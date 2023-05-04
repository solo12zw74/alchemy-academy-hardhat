import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";

const _initValue: number = 3;

describe("Counter", function () {
  async function deployCounterWithNonZeroInitValue() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(_initValue);

    return { counter, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right initial value", async function () {
      const { counter } = await loadFixture(deployCounterWithNonZeroInitValue);

      expect(await counter.counter()).to.equal(_initValue);
    });

    it("Should set the right owner", async function () {
      const { counter, owner } = await loadFixture(deployCounterWithNonZeroInitValue);

      expect(await counter.owner()).to.equal(owner.address);
    });
  });

  describe("Functions", function () {
    describe("Count", function () {
      it("Should increase the counter", async function () {
        const { counter } = await loadFixture(deployCounterWithNonZeroInitValue);
        await counter.count()
        expect(await counter.counter()).to.be.greaterThan(_initValue);
      });

      it("Should revert with the right error if called from another account", async function () {
        const { counter, otherAccount } = await loadFixture(
          deployCounterWithNonZeroInitValue
        );

        // We use lock.connect() to send a transaction from another account
        await expect(counter.connect(otherAccount).count()).to.be.revertedWithCustomError(counter, "Unauthorized")
      });
    });
  });
});
