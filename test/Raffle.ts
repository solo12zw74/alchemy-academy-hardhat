import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Raffle", function () {
    async function deployRaffle() {

        const [caller] = await ethers.getSigners();

        const Raffle = await ethers.getContractFactory("Raffle");
        const raffle = await Raffle.deploy();
        
        const RaffleProxy = await ethers.getContractFactory("RaffleProxy");
        const raffleProxy = await RaffleProxy.deploy(raffle.address);

        return { raffleProxy, caller };
    }

    describe("Tries", function () {
        it("Call from other contract", async () => {
            const { raffleProxy, caller } = await loadFixture(deployRaffle);
            console.log(`Call the RaffleProxy as a ${caller.address}`)
            await expect(raffleProxy.callAttempt()).to.not.revertedWith("msg.sender is equal to tx.origin");
        });
    });
});
