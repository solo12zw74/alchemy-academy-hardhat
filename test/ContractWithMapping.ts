import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ContractWithMapping", function () {
    async function deployContractWithMapping() {
        const ContractWithMapping = await ethers.getContractFactory("ContractWithMapping");
        const contractWithMapping = await ContractWithMapping.deploy();
        const [owner, otherAccount] = await ethers.getSigners();

        return { contractWithMapping, owner, otherAccount };
    }

    describe("addMember", function () {
        it("Should add a new memeber to the mapping", async () => {
            const { contractWithMapping, owner, otherAccount } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.addMember(owner.address);

            expect(await contractWithMapping.members(owner.address)).to.be.true;
        });
    });

    describe("isMember", function () {
        it("Should be true for added memeber", async () => {
            const { contractWithMapping, owner } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.addMember(owner.address);

            expect(await contractWithMapping.isMember(owner.address)).to.be.true;
        });

        it("Should be false for added memeber", async () => {
            const { contractWithMapping, owner, otherAccount } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.addMember(owner.address);

            expect(await contractWithMapping.isMember(otherAccount.address)).to.be.false;
        });
    });

    describe("removeMember", function () {
        it("Should remove the member", async () => {
            const { contractWithMapping, owner } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.addMember(owner.address);
            await contractWithMapping.removeMember(owner.address);

            expect(await contractWithMapping.isMember(owner.address)).to.be.false;
        });

        it("Should remove the correct member", async () => {
            const { contractWithMapping, owner, otherAccount } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.addMember(owner.address);
            await contractWithMapping.addMember(otherAccount.address);
            await contractWithMapping.removeMember(owner.address);

            expect(await contractWithMapping.isMember(owner.address)).to.be.false;
            expect(await contractWithMapping.isMember(otherAccount.address)).to.be.true;
        });

        it("Should be false for added memeber", async () => {
            const { contractWithMapping, owner, otherAccount } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.addMember(owner.address);

            expect(await contractWithMapping.isMember(otherAccount.address)).to.be.false;
        });
    });

    describe("createUser", function () {
        it("Should add a new user to the users mapping", async () => {
            const { contractWithMapping, owner } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.createUser();

            expect((await contractWithMapping.users(owner.address)).balance).to.be.equal(100);
            expect((await contractWithMapping.users(owner.address)).isActive).to.be.true;
        });

        it("Should not create user twice for the same account", async () => {
            const { contractWithMapping, owner } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.createUser();

            await expect(contractWithMapping.createUser()).to.be.rejected;
        });
    });

    describe("transfer", function () {
        it("Should change the balance for sender and recepient", async () => {
            const { contractWithMapping, owner, otherAccount } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.createUser();
            await contractWithMapping.connect(otherAccount).createUser();

            await contractWithMapping.transfer(otherAccount.address, 37);

            expect((await contractWithMapping.users(owner.address)).balance).to.be.equal(63);
            expect((await contractWithMapping.users(otherAccount.address)).balance).to.be.equal(137);
        });

        it("Should reject transactiont for non-existing sender", async () => {
            const { contractWithMapping, otherAccount } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.connect(otherAccount).createUser();
            await expect(contractWithMapping.transfer(otherAccount.address, 37)).to.be.rejected;
        });

        it("Should reject transactiont for non-existing recepient", async () => {
            const { contractWithMapping, otherAccount } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.createUser();
            await expect(contractWithMapping.transfer(otherAccount.address, 37)).to.be.rejected;
        });

        it("Should reject transactiont for insufficient funds", async () => {
            const { contractWithMapping, owner, otherAccount } = await loadFixture(deployContractWithMapping);
            await contractWithMapping.createUser();
            await contractWithMapping.connect(otherAccount).createUser();
            await expect(contractWithMapping.transfer(otherAccount.address, 1000)).to.be.rejected;

        });
    });
});
