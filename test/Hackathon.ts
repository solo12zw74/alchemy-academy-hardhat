import { assert } from "chai";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { Hackathon } from "../typechain-types";
import { PromiseOrValue } from "../typechain-types/common";

describe("Hackathon", () => {
    describe("with a single project", () => {
        let contract: Hackathon;
        const projectName = "Only";

        beforeEach(async () => {
            const Hackathon = await ethers.getContractFactory("Hackathon");
            contract = await Hackathon.deploy();
            await contract.newProject(projectName);
            await contract.rate(0, 4);
        });

        it("should award the sole participant", async () => {
            const winner = await contract.findWinner();
            assert.equal(winner.title, projectName);
        });
    });

    describe("with multiple projects", () => {
        describe("and a single judge", () => {
            let contract: Hackathon;
            const participant1 = "First";
            const expectedWinner = "Winning";
            const participant2 = "Second";

            beforeEach(async () => {
                const Hackathon = await ethers.getContractFactory("Hackathon");
                contract = await Hackathon.deploy();
                await contract.newProject(participant1);
                await contract.newProject(expectedWinner);
                await contract.newProject(participant2);
                await contract.rate(0, 4);
                await contract.rate(1, 5);
                await contract.rate(2, 2);
            });

            it("should award the highest rated", async () => {
                const actualWinner = await contract.findWinner();
                assert.equal(actualWinner.title, expectedWinner);
            });
        });

        describe("and multiple judges", () => {
            let contract: Hackathon;
            const expectedWinner: string = "Winning";
            const participant1: string = "First";
            const participant2: string = "Second";

            beforeEach(async () => {
                const Hackathon = await ethers.getContractFactory("Hackathon");
                contract = await Hackathon.deploy();
                const projects = [
                    [participant1, [2, 2, 2, 2, 2, 2]],
                    [participant2, [0, 4]],
                    [expectedWinner, [2, 3, 4]],
                ];
                await Promise.all(
                    projects.map(async ([title, ratings], idx) => {
                        await contract.newProject(title);
                        await Promise.all(
                            ratings.map(async (r: PromiseOrValue<BigNumberish>) => await contract.rate(idx, r))
                        );
                    })
                );
            });

            it("should award the highest average", async () => {
                const actualWinner = await contract.findWinner();
                assert.equal(actualWinner.title, expectedWinner);
            });
        });
    });
});
