import { BigNumber } from "@ethersproject/bignumber";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const DEPOSIT: BigNumber = ethers.utils.parseEther("2");

describe("Party", function () {
    async function deployParty() {

        const [caller] = await ethers.getSigners();

        const Party = await ethers.getContractFactory("Party");
        const party = await Party.deploy(DEPOSIT);

        return { party, caller };
    }

    it("should allow to deploy contract with positive deposit", async () => {
        const { party } = await loadFixture(deployParty);
        expect(await party.deposit()).to.equal(DEPOSIT);
    });

    it("should allow join party with exact deposit", async () => {
        const { party } = await loadFixture(deployParty);
        await expect(party.rsvp({ value: DEPOSIT })).is.not.rejected;
    });

    it("should decline join with smaller deposit", async () => {
        const { party } = await loadFixture(deployParty);
        await expect(party.rsvp({ value: DEPOSIT.sub(10) })).is.rejected;
    });

    it("should decline when joining twice", async () => {
        const { party } = await loadFixture(deployParty);
        await party.rsvp({ value: DEPOSIT });
        await expect(party.rsvp({ value: DEPOSIT })).is.rejected;
    });
});