// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ContractWithEvents {
    event Deployed(address _address);

    constructor() {
        emit Deployed(msg.sender);
    }
}
