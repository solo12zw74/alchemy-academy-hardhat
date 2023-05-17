import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Arrays } from "../typechain-types";

async function deployArrays() {
    const Arrays = await ethers.getContractFactory("Arrays");
    const arrays = await Arrays.deploy();
    return { arrays };
}

describe("Arrays", () => {
    let _arrays: Arrays;
    before(async () => {
        const { arrays } = await loadFixture(deployArrays);
        _arrays = arrays;
    });

    it("should sum 5 numbers", async () => {
        const actual = await _arrays.sum([1, 2, 3, 4, 5]);
        expect(actual).is.to.eq(15);
    });
});