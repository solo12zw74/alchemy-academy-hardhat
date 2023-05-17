import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Arrays } from "../typechain-types";
import { BigNumberish, CallOverrides, BigNumber } from "ethers";
import { PromiseOrValue } from "../typechain-types/common";

async function deployArrays() {
    const Arrays = await ethers.getContractFactory("Arrays");
    const arrays = await Arrays.deploy();
    return { arrays };
}
async function getArrayElements(getterFn: { (arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides | undefined): Promise<BigNumber>; (arg0: any): any; }) {
    let vals = [];
    try {
        for (let i: number = 0; ; i++) {
            vals.push(await getterFn(i));
        }
    }
    catch (ex) { }
    return vals.map(x => Number(x));
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

    it("should sum any numbers", async () => {
        expect(await _arrays.sum([1, 2, 3, 4, 5])).is.to.eq(15);
        expect(await _arrays.sum([5])).is.to.eq(5);
        expect(await _arrays.sum([1, 1, 1])).is.to.eq(3);
    });

    it("should filter evens from the input", async () => {
        await _arrays.filterEven([1, 2, 3, 4, 5, 6]);
        expect(await getArrayElements(_arrays.evenNumbers)).has.same.members([2, 4, 6].map(v => Number(v)));
    });
});