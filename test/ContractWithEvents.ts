import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("ContractWithEvents", function () {
    async function deployContractWithEvents() {
        const ContractWithEvents = await ethers.getContractFactory("ContractWithEvents");
        const contractWithEvents = await ContractWithEvents.deploy();
        const [owner, otherAccount] = await ethers.getSigners();

        return { contractWithEvents, owner, otherAccount };
    }

    describe("contructor", function () {
        it("Emit Deployed event", async () => {
            const ContractWithEvents = await ethers.getContractFactory("ContractWithEvents");
            const contractWithEvents = await ContractWithEvents.deploy();
            const receipt = await contractWithEvents.deployTransaction.wait();
            const topic = contractWithEvents.interface.getEventTopic('Deployed');
            const log = receipt.logs.find(v => v.topics.indexOf(topic) >= 0);
            const event = contractWithEvents.interface.parseLog(log);
            expect(event).to.be.not.undefined;
        });
    });
});
