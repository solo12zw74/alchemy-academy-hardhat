import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("OwnedContract", function () {
    async function deployOwnedContract() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const OwnedContract = await ethers.getContractFactory("OwnedContract");
        const ownedContract = await OwnedContract.deploy();

        return { ownedContract, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the owner", async function () {
            const { ownedContract, owner } = await loadFixture(deployOwnedContract);

            expect(await ownedContract.owner()).to.equal(owner.address);
        });
    });

    describe("Functions", function () {
        it('Should receive the ether', async () => {
            const { ownedContract, owner, otherAccount } = await loadFixture(deployOwnedContract);
            const value = ethers.utils.parseEther("1");
            await otherAccount.sendTransaction({ to: ownedContract.address, value });
            const balance = await ethers.provider.getBalance(ownedContract.address);
            expect(balance).to.equal(value, "expected the ether to be received");
        });
        it('Should receive tips for owner', async () => {
            const { ownedContract, owner, otherAccount } = await loadFixture(deployOwnedContract);
            const value = ethers.utils.parseEther("1");
            const balanceBefore = await ethers.provider.getBalance(owner.address);
            await ownedContract.connect(otherAccount).tip({ value });
            const balanceAfter = await ethers.provider.getBalance(owner.address);
            expect(balanceAfter).to.greaterThan(balanceBefore, "expected the tips to be received");
        });
    });

});
