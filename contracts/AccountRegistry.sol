// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IAccountRegistry.sol";

contract AccountRegistry is IAccountRegistry {
    function checkAccount(address user) external view returns (bool) {
        require(user != address(this));
        return true;
    }
}
