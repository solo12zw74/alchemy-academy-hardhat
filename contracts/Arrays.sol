// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Arrays {
    function sum(uint[5] memory values) public pure returns (uint result) {
        for (uint256 index = 0; index < 5; index++) {
            result += values[index];
        }
    }
}
