import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("OwnedContract", function () {
    let _charityAddress: string;
    async function deployOwnedContract() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount, charityAddress] = await ethers.getSigners();

        _charityAddress = charityAddress.address;
        const OwnedContract = await ethers.getContractFactory("OwnedContract");
        const ownedContract = await OwnedContract.deploy(charityAddress.address);

        return { ownedContract, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the owner", async function () {
            const { ownedContract, owner } = await loadFixture(deployOwnedContract);

            expect(await ownedContract.owner()).to.equal(owner.address);
        });
    });

    describe("Functions", function () {
        const value = ethers.utils.parseEther("1");

        it('Should receive the ether', async () => {
            const { ownedContract, otherAccount } = await loadFixture(deployOwnedContract);
            await otherAccount.sendTransaction({ to: ownedContract.address, value });
            const balance = await ethers.provider.getBalance(ownedContract.address);
            expect(balance).to.equal(value, "expected the ether to be received");
        });

        it('Should receive tips for owner', async () => {
            const { ownedContract, owner, otherAccount } = await loadFixture(deployOwnedContract);
            const balanceBefore = await ethers.provider.getBalance(owner.address);
            await ownedContract.connect(otherAccount).tip({ value });
            const balanceAfter = await ethers.provider.getBalance(owner.address);
            expect(balanceAfter).to.greaterThan(balanceBefore, "expected the tips to be received");
        });

        it('Should reject on tips from owner to himself', async () => {
            const { ownedContract, owner } = await loadFixture(deployOwnedContract);
            await expect(ownedContract.connect(owner).tip({ value })).to.be.revertedWithoutReason()
        });

        it('Should donate to charity', async () => {
            const { ownedContract, owner, otherAccount } = await loadFixture(deployOwnedContract);
            await otherAccount.sendTransaction({ to: ownedContract.address, value });
            await owner.sendTransaction({ to: ownedContract.address, value });
            const balanceBefore = await ethers.provider.getBalance(_charityAddress);
            await ownedContract.donate();
            const balanceAfter = await ethers.provider.getBalance(_charityAddress);
            const expectedBalance = value.add(value)
            expect(balanceAfter.sub(balanceBefore)).to.equal(expectedBalance, "expected the ether to be received");
        });
    });

});
