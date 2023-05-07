import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("DepositContract", function () {
    describe("Deployment", function () {
        it("Should revert if deposit is less then required", async function () {
            const DepositContract = await ethers.getContractFactory("DepositContract");

            try {
                const depositContract = await DepositContract.deploy({ value: 0 });
            } catch (error) {
                expect(error).to.be.revertedWith("Amont must be greater than or equal of 1 ether");
            }

        });

        it("Should deploy well if deposit is big enough", async function () {
            const DepositContract = await ethers.getContractFactory("DepositContract");
            const depositAmount = ethers.utils.parseEther("1");
            const depositContract = await DepositContract.deploy({ value: depositAmount });
            expect((await depositContract.depositAmount()).toString()).to.be.equal(depositAmount.toString());
        });
    });
});
