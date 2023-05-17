// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Arrays {
    uint[] public evenNumbers;

    function sum(uint[] memory values) external pure returns (uint result) {
        for (uint256 index = 0; index < values.length; index++) {
            result += values[index];
        }
    }

    function filterEven(uint[] memory values) external {
        for (uint256 i = 0; i < values.length; i++) {
            if (values[i] % 2 == 0) {
                evenNumbers.push(values[i]);
            }
        }
    }
}
