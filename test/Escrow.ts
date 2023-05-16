import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Escrow } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function deployEscrow() {
    const Escrow = await ethers.getContractFactory("Escrow");
    const [depositor, arbiter, beneficiary] = await ethers.getSigners();

    const escrow = await Escrow.deploy(arbiter.address, beneficiary.address);
    return { escrow, depositor, arbiter, beneficiary };
}

describe("Escrow", function () {
    it("Contains required parties", async () => {
        const { escrow } = await loadFixture(deployEscrow);
        expect(escrow).has.property("depositor");
        expect(escrow).has.property("beneficiary");
        expect(escrow).has.property("arbiter");
    });

    describe("Assign all addresses correctly", () => {
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

    it("Has all addresses assigned afer deploy", async () => {

    });
});