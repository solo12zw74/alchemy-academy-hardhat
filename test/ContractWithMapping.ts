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
});
