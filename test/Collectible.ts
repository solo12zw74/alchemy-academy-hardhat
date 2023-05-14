import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Collectible", function () {
    async function deployCollectible() {
        const Collectible = await ethers.getContractFactory("Collectible");
        const collectible = await Collectible.deploy();
        const [owner, otherAccount] = await ethers.getSigners();

        return { collectible, owner, otherAccount };
    }
    it("Set owner on construction", async function () {
        const { collectible, owner } = await loadFixture(deployCollectible);
        const collectibleOwnner = await collectible.owner();
        expect(collectibleOwnner).is.to.equal(owner.address);
    });

    describe("transfer", function () {
        it("Transfer collectible to other address", async function () {
            const { collectible, owner, otherAccount } = await loadFixture(deployCollectible);
            await collectible.transfer(otherAccount.address);
            const collectibleOwner = await collectible.owner();
            expect(collectibleOwner).is.to.equal(otherAccount.address);
        });

        it("Doesn't allow to transfer twice", async function () {
            const { collectible, otherAccount } = await loadFixture(deployCollectible);
            await collectible.transfer(otherAccount.address);
            await expect(collectible.transfer(otherAccount.address)).is.rejected;
        });

        it("Emit a Transfer event", async function () {
            const { collectible, owner, otherAccount } = await loadFixture(deployCollectible);
            await expect(collectible.transfer(otherAccount.address)).to.emit(collectible, "Transfer")
                .withArgs(owner.address, otherAccount.address);
        });
    });

    describe("markPrice", function () {
        it("Should not allow markPrice for non owner", async function () {
            const { collectible, otherAccount } = await loadFixture(deployCollectible);
            await expect(collectible.connect(otherAccount.address).markPrice(1000))
                .is
                .rejected;
        });

        it("Should emit ForSale event", async function () {
            const { collectible } = await loadFixture(deployCollectible);
            await expect(collectible.markPrice(1000))
                .to
                .emit(collectible, "ForSale");
        });
    });

    describe("Purchase", function () {
        it("Should reject if not for sale", async function () {
            const { collectible, otherAccount } = await loadFixture(deployCollectible);
            await expect(collectible.connect(otherAccount).purchase()).to.rejected;
        });

        it("Should reject if price is lower than marked", async function () {
            const { collectible, owner, otherAccount } = await loadFixture(deployCollectible);
            await collectible.markPrice(ethers.utils.parseEther("2"));
            await expect(collectible
                .purchase({ value: ethers.utils.parseEther("1") })).to.be.rejected;
        });

        it("Balances should change", async function () {
            const { collectible, owner, otherAccount } = await loadFixture(deployCollectible);
            await collectible.markPrice(ethers.utils.parseEther("1"));
            const ownerBalanceBefore = await owner.getBalance();
            const buyerBalanceBefore = await otherAccount.getBalance();
            await collectible.connect(otherAccount).purchase({ value: ethers.utils.parseEther("2") });
            const ownerBalanceAfter = await owner.getBalance();
            const buyerBalanceAfter = await otherAccount.getBalance();

            expect(ownerBalanceBefore).to.be.lessThan(ownerBalanceAfter);
            expect(buyerBalanceBefore).to.be.greaterThan(buyerBalanceAfter);
        });
    });
});