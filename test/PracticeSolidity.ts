import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PracticeSolidity", function () {
    async function deployPracticeSolidity() {
        const PracticeSolidity = await ethers.getContractFactory("PracticeSolidity");
        const practiceSolidity = await PracticeSolidity.deploy();

        return { practiceSolidity };
    }

    describe("Functions", function () {
        describe("sumAndAverage", function () {
            [[2, 2, 4, 4], [1, 3, 5, 7], [8, 8, 8, 8]].forEach(([a, b, c, d]) => {
                const expectedSum = a + b + c + d;
                const expectedAverage = expectedSum / 4;
                describe(`for ${a}, ${b}, ${c} and ${d}`, () => {
                    it(`it should return ${expectedSum} and ${expectedAverage}`, async () => {
                        const { practiceSolidity } = await loadFixture(deployPracticeSolidity);

                        const values = await practiceSolidity.sumAndAverage(a, b, c, d);
                        expect(values[0]).to.equal(expectedSum);
                        expect(values[1]).to.equal(expectedAverage);
                    });
                });
            });
        });
    });
});
