import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { StackClub } from "../typechain-types";
import { expect } from "chai";

async function deployStackClub() {
    const StackClub = await ethers.getContractFactory("StackClub");
    const stackClub = await StackClub.deploy();
    const [owner, otherAddress] = await ethers.getSigners();

    return { stackClub, owner, otherAddress };
}
describe("StackClub", () => {
    let _stackClub: StackClub;
    let _owner: SignerWithAddress;
    let _otherAddress: SignerWithAddress;
    beforeEach(async () => {
        const { stackClub, owner, otherAddress } = await loadFixture(deployStackClub);
        _stackClub = stackClub;
        _owner = owner;
        _otherAddress = otherAddress;
    });

    describe("addMember", () => {
        it("should add members to the array", async () => {
            await _stackClub.addMember(_owner.address);
            expect(await _stackClub.members(0)).is.to.eq(_owner.address)
        });
    });

    describe("isMember", () => {

        it("should return true for existing member", async () => {
            await _stackClub.addMember(_owner.address);
            expect(await _stackClub.isMember(_owner.address)).is.true;
        });
        it("should return false for non-existing member", async () => {
            expect(await _stackClub.isMember(_otherAddress.address)).is.false;
        });
    });
});