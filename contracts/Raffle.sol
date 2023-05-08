// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Raffle {
    event Winner(address);

    constructor() {
        console.log("Raffle is deployed with address: ", address(this));
    }

    function attempt() external {
        require(msg.sender != tx.origin, "msg.sender is equal to tx.origin");
        console.log("msg.sender: ", msg.sender);
        console.log("tx.origin: ", tx.origin);

        emit Winner(msg.sender);
    }
}
