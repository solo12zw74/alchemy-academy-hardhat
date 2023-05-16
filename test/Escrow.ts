import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


async function deployEscrow() {
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    const [owner, otherAccount] = await ethers.getSigners();

    return { escrow, owner, otherAccount };
}

describe("Escrow", function () {
    it("Contains required parties", async function () {
        const { escrow } = await loadFixture(deployEscrow);
        expect(escrow).has.property("depositor");
        expect(escrow).has.property("beneficiary");
        expect(escrow).has.property("arbiter");
    });
});