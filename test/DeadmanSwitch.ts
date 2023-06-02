import { assert } from 'chai';
import { ethers } from "hardhat";
import { DeadmanSwitch } from '../typechain-types';
import { BigNumber, ContractTransaction, Signer } from 'ethers';

const passTime = (time: number) => ethers.provider.send('evm_increaseTime', [time]);
const oneWeek = 60 * 60 * 24 * 7;
const gasPrice = ethers.utils.parseUnits("1", "gwei");
const oneEther = ethers.utils.parseEther("1");

describe('Switch', function () {

    let contract: DeadmanSwitch;
    let owner: Signer, recipient: Signer, other: Signer;
    let recipientAddr: string;

    beforeEach(async () => {
        owner = ethers.provider.getSigner(0);
        recipient = ethers.provider.getSigner(1);
        recipientAddr = await recipient.getAddress();
        other = ethers.provider.getSigner(2);

        const DeadmanSwitch = await ethers.getContractFactory("DeadmanSwitch");
        contract = await DeadmanSwitch.deploy(recipientAddr, { value: oneEther });
        await contract.deployed();
    });

    it('should not allow the recipient to ping', async () => {
        await assertThrows(
            contract.connect(recipient).ping(),
            "Expected transaction to revert! The recipient cannot ping the switch."
        );
    });

    it('should not allow some other account to ping', async () => {
        await assertThrows(
            contract.connect(other).ping(),
            "Expected transaction to revert! Other account cannot ping the switch."
        );
    });

    describe('after 70 weeks of inactivity', () => {
        beforeEach(async () => {
            await passTime(oneWeek * 70);
        });

        it('should allow the recipient to withdraw', async () => await assertBalanceChange(
            recipientAddr, oneEther,
            () => contract.connect(recipient).withdraw({ gasPrice }),
            "Expected the recipient to receive the deposit"
        ));
    });

    describe('after 40 weeks of inactivity since deployment', () => {
        beforeEach(async () => {
            await passTime(oneWeek * 40);
        });

        it('should not allow the recipient to withdraw', async () => {
            await assertThrows(
                contract.connect(recipient).withdraw(),
                "Expected transaction to revert! 40 weeks is not long enough inactivity."
            );
        });

        describe('after 40 more weeks of inactivity', () => {
            beforeEach(async () => {
                await passTime(oneWeek * 40);
            });

            it('should allow the recipient to withdraw', async () => await assertBalanceChange(
                recipientAddr, oneEther,
                () => contract.connect(recipient).withdraw({ gasPrice }),
                "Expected the recipient to receive the deposit"
            ));
        });

        describe('after pinging', () => {
            beforeEach(async () => {
                await contract.connect(owner).ping();
            });

            describe('after 40 more weeks of inactivity', () => {
                beforeEach(async () => {
                    await passTime(oneWeek * 40);
                });

                it('should not allow the recipient to withdraw', async () => {
                    await assertThrows(
                        contract.connect(recipient).withdraw(),
                        "Expected transaction to revert! 40 weeks is not long enough inactivity."
                    );
                });

                describe('after 40 more weeks of inactivity', () => {
                    beforeEach(async () => {
                        await passTime(oneWeek * 40);
                    });

                    it('should allow the recipient to withdraw', async () => await assertBalanceChange(
                        recipientAddr, oneEther,
                        () => contract.connect(recipient).withdraw({ gasPrice }),
                        "Expected the recipient to receive the deposit"
                    ));
                });
            });
        });
    });
});

async function assertBalanceChange(address: string, change: BigNumber, tx: { (): Promise<ContractTransaction>; (): Promise<ContractTransaction>; (): Promise<ContractTransaction>; (): any; }, msg: string | undefined) {
    const balanceBefore = await ethers.provider.getBalance(address);
    const { gasUsed } = await (await tx()).wait();
    const balanceAfter = await ethers.provider.getBalance(address);
    const gasInWei = ethers.utils.parseUnits(gasUsed.toString(), "gwei");
    assert.equal(
        change.toString(),
        balanceAfter.add(gasInWei).sub(balanceBefore).toString(),
        msg,
    );
}

async function assertThrows(promise: Promise<ContractTransaction>, msg: string | undefined) {
    let ex;
    try {
        await promise;
    }
    catch (_ex) {
        ex = _ex;
    }
    assert(ex, msg);
}