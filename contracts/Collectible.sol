// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Collectible {
    address public owner;
    event Transfer(address _originalOwner, address _newOwner);

    constructor() {
        owner = msg.sender;
    }

    function transfer(address _newOwner) external {
        require(msg.sender == owner);
        owner = _newOwner;
        emit Transfer(msg.sender, _newOwner);
    }
}
