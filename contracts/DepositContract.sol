// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DepositContract {
    uint private minDepositAmount = 1 ether;
    uint public depositAmount;

    constructor() payable {
        require(
            msg.value >= minDepositAmount,
            "Amont must be greater than or equal of 1 ether"
        );
        depositAmount = msg.value;
    }
}
