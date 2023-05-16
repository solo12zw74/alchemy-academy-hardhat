import { ethers } from "hardhat";
import { PromiseOrValue } from "../typechain-types/common";

const deposit = ethers.utils.parseEther("2");

async function main(arbiter: PromiseOrValue<string>, beneficiary: PromiseOrValue<string>) {
  const EscrowFactory = await ethers.getContractFactory("Escrow");
  const escrow = await EscrowFactory.deploy(arbiter, beneficiary, { value: deposit });

  return escrow.deployed();
}

const arbiter = process.argv[0];
const beneficiary = process.argv[1];
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(arbiter, beneficiary).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
