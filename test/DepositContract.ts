import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("DepositContract", function () {
    const ONE_ETHER = ethers.utils.parseEther("1");
    async function deployDepositContract() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const AccountRegistry = await ethers.getContractFactory("AccountRegistry");
        const accountRegistry = await AccountRegistry.deploy();

        const DepositContract = await ethers.getContractFactory("DepositContract");
        const depositContract = await DepositContract.deploy(accountRegistry.address, { value: ONE_ETHER });

        return { depositContract, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should revert if deposit is less then required", async function () {
            const DepositContract = await ethers.getContractFactory("DepositContract");

            try {
                await DepositContract.deploy("", { value: 0 });
            } catch (error) {
                expect(error).to.be.revertedWith("Amont must be greater than or equal of 1 ether");
            }

        });

        it("Should deploy well if deposit is big enough", async function () {
            const { depositContract } = await loadFixture(deployDepositContract);
            expect((await depositContract.depositAmount()).toString()).to.be.equal(ONE_ETHER.toString());
        });
    });
    describe("Withdrawals", function () {
        it("Should fail for non-owner", async function () {
            const { depositContract, otherAccount } = await loadFixture(deployDepositContract);

            await expect(depositContract.connect(otherAccount).withdraw()).to.be.revertedWith("Only owner can withdraw");
        });

        it("Should works well for owner", async function () {
            const { depositContract, owner } = await loadFixture(deployDepositContract);
            const beforeWithdraw = await owner.getBalance();
            await depositContract.withdraw();
            const afterWithdraw = await owner.getBalance();
            expect(beforeWithdraw).to.be.lessThan(afterWithdraw);
        });
    });
});
