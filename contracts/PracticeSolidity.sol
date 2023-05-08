// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PracticeSolidity {
    uint8 private ticks = 10;

    function sumAndAverage(
        uint a,
        uint b,
        uint c,
        uint d
    ) external pure returns (uint sum, uint avg) {
        sum = a + b + c + d;
        avg = sum / 4;
    }

    function tick() external {
        ticks--;
        if (ticks == 0) {
            selfdestruct(payable(msg.sender));
        }
    }
}
