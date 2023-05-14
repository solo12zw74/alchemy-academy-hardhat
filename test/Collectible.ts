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