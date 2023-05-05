// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract OwnedContract {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function tip() external payable {
        require(msg.sender != owner);
        (bool result, ) = owner.call{value: msg.value}("");
        require(result);
    }
}
