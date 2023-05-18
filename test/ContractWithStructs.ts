import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ContractWithStructs } from "../typechain-types";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const CHOICES = {
    YES: 0,
    NO: 1,
}

async function deployContractWithStructs() {
    const ContractWithStructs = await ethers.getContractFactory("ContractWithStructs");
    const contractWithStructs = await ContractWithStructs.deploy();
    const [owner] = await ethers.getSigners();

    return { contractWithStructs, owner };
}

describe("ContractWithStructs", () => {
    describe("createVote", () => {
        let _contractWithStructs: ContractWithStructs,
            _owner: SignerWithAddress;
        beforeEach(async () => {
            const { contractWithStructs, owner } = await loadFixture(deployContractWithStructs);
            _contractWithStructs = contractWithStructs;
            _owner = owner;
        });
        it("should have the empty initial state for vote", async () => {
            const [address, choice] = await _contractWithStructs.vote();
            expect(address).is.eq(ethers.constants.AddressZero);
            expect(choice).is.eq(CHOICES.YES);
        });

        it("should change the Vote state", async () => {
            await _contractWithStructs.createVote(CHOICES.NO)
            const [address, choice] = await _contractWithStructs.vote();
            expect(address).is.eq(_owner.address);
            expect(choice).is.eq(CHOICES.NO);
        });
    });
});