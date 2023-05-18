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
    const [owner, otherAddress] = await ethers.getSigners();

    return { contractWithStructs, owner, otherAddress };
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
    describe("createVoteInstance", () => {
        it("should return a vote as struct", async () => {
            const { contractWithStructs, owner } = await loadFixture(deployContractWithStructs);

            const vote = await contractWithStructs.createVoteInstance(CHOICES.NO);
            expect(vote.Choise).is.eq(CHOICES.NO);
            expect(vote.Voter).is.eq(owner.address);
        });
    });

    describe("createVoteInStore", () => {
        it("should add votes to array", async () => {
            const { contractWithStructs, owner, otherAddress } = await loadFixture(deployContractWithStructs);

            await contractWithStructs.createVoteInStore(CHOICES.NO);
            await contractWithStructs.connect(otherAddress).createVoteInStore(CHOICES.YES);
            const vote0 = await contractWithStructs.votes(0);
            const vote1 = await contractWithStructs.votes(1);
            expect(vote0.Voter).is.eq(owner.address);
            expect(vote0.Choise).is.eq(CHOICES.NO);
            expect(vote1.Voter).is.eq(otherAddress.address);
            expect(vote1.Choise).is.eq(CHOICES.YES);

        });
    });
});