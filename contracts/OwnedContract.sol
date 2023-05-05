// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract OwnedContract {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}
}
