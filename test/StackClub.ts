import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { StackClub } from "../typechain-types";
import { expect } from "chai";

async function deployStackClub() {
    const StackClub = await ethers.getContractFactory("StackClub");
    const stackClub = await StackClub.deploy();
    const [owner, otherAddress, thirdAddress] = await ethers.getSigners();

    return { stackClub, owner, otherAddress, thirdAddress };
}
describe("StackClub", () => {
    let _stackClub: StackClub,
        _owner: SignerWithAddress,
        _otherAddress: SignerWithAddress,
        _thirdAddress: SignerWithAddress;

    beforeEach(async () => {
        const { stackClub, owner, otherAddress, thirdAddress } = await loadFixture(deployStackClub);
        _stackClub = stackClub;
        _owner = owner;
        _otherAddress = otherAddress;
        _thirdAddress = thirdAddress;
    });

    describe("Deployed", () => {
        it("should contains owner initially", async () => {
            expect(await _stackClub.members(0)).is.to.eq(_owner.address)
        });
    });

    describe("addMember", () => {
        it("should add members to the array", async () => {
            await _stackClub.addMember(_otherAddress.address);
            expect(await _stackClub.members(1)).is.to.eq(_otherAddress.address)
        });
    });

    describe("isMember", () => {
        it("should return true for existing member", async () => {
            await _stackClub.addMember(_otherAddress.address);
            expect(await _stackClub.isMember(_otherAddress.address)).is.true;
        });
        it("should return false for non-existing member", async () => {
            expect(await _stackClub.isMember(_thirdAddress.address)).is.false;
        });
    });

    describe("removeLastMember", () => {
        it("should remove last member", async () => {
            await _stackClub.addMember(_otherAddress.address);
            await _stackClub.addMember(_thirdAddress.address);
            expect(await _stackClub.members(2)).is.eq(_thirdAddress.address);
            await _stackClub.removeLastMember();
            await expect(_stackClub.members(2)).is.reverted;
        });
    });
});