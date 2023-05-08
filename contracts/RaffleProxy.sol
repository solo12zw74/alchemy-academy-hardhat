// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Raffle.sol";
import "hardhat/console.sol";

contract RaffleProxy {
    address private raffleAddress;

    constructor(address _raffleAddress) {
        raffleAddress = _raffleAddress;
        console.log("RaffleProxy is deployed with address: ", address(this));
    }

    function callAttempt() external {
        Raffle(raffleAddress).attempt();
    }
}
