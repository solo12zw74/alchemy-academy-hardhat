// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PracticeSolidity {
    function sumAndAverage(
        uint a,
        uint b,
        uint c,
        uint d
    ) external pure returns (uint sum, uint avg) {
        sum = a + b + c + d;
        avg = sum / 4;
    }
}
