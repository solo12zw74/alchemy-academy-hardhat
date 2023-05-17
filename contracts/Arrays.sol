// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Arrays {
    function sum(uint[] memory values) public pure returns (uint result) {
        for (uint256 index = 0; index < values.length; index++) {
            result += values[index];
        }
    }
}
