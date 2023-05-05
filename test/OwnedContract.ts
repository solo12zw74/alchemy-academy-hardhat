import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("OwnedContract", function () {
    async function deployOwnedContract() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const OwnedContract = await ethers.getContractFactory("OwnedContract");
        const ownedContract = await OwnedContract.deploy();

        return { ownedContract, owner };
    }

    describe("Deployment", function () {
        it("Should set the owner", async function () {
            const { ownedContract, owner } = await loadFixture(deployOwnedContract);

            expect(await ownedContract.owner()).to.equal(owner.address);
        });

        it('Should receive the ether', async () => {
            const { ownedContract, owner } = await loadFixture(deployOwnedContract);
            const value = ethers.utils.parseEther("1");
            await owner.sendTransaction({ to: ownedContract.address, value });
            const balance = await ethers.provider.getBalance(ownedContract.address);
            expect(balance).to.equal(value, "expected the ether to be received");
        });
    });
});
