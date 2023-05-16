import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Escrow } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const initialDeposit = ethers.utils.parseEther("3.1");
async function deployEscrow() {
    const Escrow = await ethers.getContractFactory("Escrow");
    const [depositor, arbiter, beneficiary] = await ethers.getSigners();

    const escrow = await Escrow.deploy(arbiter.address, beneficiary.address, { value: initialDeposit });
    return { escrow, depositor, arbiter, beneficiary };
}

describe("Escrow", function () {

    describe("Construction", () => {
        let _escrow: Escrow;
        let _depositor: SignerWithAddress;
        let _arbiter: SignerWithAddress;
        let _beneficiary: SignerWithAddress;

        before(async () => {
            const { escrow, depositor, arbiter, beneficiary } = await loadFixture(deployEscrow);
            _escrow = escrow;
            _depositor = depositor;
            _arbiter = arbiter;
            _beneficiary = beneficiary;
        });

        it("Contains required parties", async () => {
            expect(_escrow).has.property("depositor");
            expect(_escrow).has.property("beneficiary");
            expect(_escrow).has.property("arbiter");
        });

        it("should deposit on deploy", async () => {
            const balance = await ethers.provider.getBalance(_escrow.address);
            expect(balance).is.to.eq(initialDeposit);
        });

        describe("Assign all addresses correctly", () => {
            it("should have creator as depositer", async () => {
                expect(await _escrow.depositor()).is.to.eq(_depositor.address);
            });

            it("should have correct arbiter", async () => {
                expect(await _escrow.arbiter()).is.to.eq(_arbiter.address);
            });

            it("should have correct beneficiary", async () => {
                expect(await _escrow.beneficiary()).is.to.eq(_beneficiary.address);
            });
        });
    });

    describe("Approval", () => {
        let _escrow: Escrow;
        let _depositor: SignerWithAddress;
        let _arbiter: SignerWithAddress;
        let _beneficiary: SignerWithAddress;

        beforeEach(async () => {
            const { escrow, depositor, arbiter, beneficiary } = await loadFixture(deployEscrow);
            _escrow = escrow;
            _depositor = depositor;
            _arbiter = arbiter;
            _beneficiary = beneficiary;
        });

        it("should reqject for wrong approver", async () => {
            await expect(_escrow.approve()).is.rejected;
        });

        it("should reqject if already approved", async () => {
            await _escrow.connect(_arbiter).approve();
            await expect(_escrow.connect(_arbiter).approve()).is.rejected;
        });

        it("should approve correctly", async () => {
            const beneficiaryBalanceBefore = await ethers.provider.getBalance(_beneficiary.address);
            await _escrow.connect(_arbiter).approve();
            const contractBalance = await ethers.provider.getBalance(_escrow.address);
            const beneficiaryBalanceAfter = await ethers.provider.getBalance(_beneficiary.address);

            expect(contractBalance).is.to.eq(0);
            expect(beneficiaryBalanceAfter).is.greaterThan(beneficiaryBalanceBefore);
        });

        it("should emit Approved event", async () => {
            expect(await _escrow.connect(_arbiter).approve()).is.emit(_escrow, "Approved");
        });
    });
});