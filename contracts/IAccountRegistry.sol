// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IAccountRegistry {
    function checkAccount(address user) external view returns (bool);
}
