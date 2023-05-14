// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Collectible {
    address public owner;
    uint public price;

    event Transfer(address _originalOwner, address _newOwner);
    event ForSale(uint, uint);
    event Purchase(uint, address);

    constructor() {
        owner = msg.sender;
    }

    function transfer(address _newOwner) public {
        require(msg.sender == owner);
        owner = _newOwner;
        emit Transfer(msg.sender, _newOwner);
    }

    function markPrice(uint _price) external {
        require(msg.sender == owner);
        price = _price;
        emit ForSale(_price, block.timestamp);
    }

    function purchase() external payable {
        require(price > 0);
        require(msg.value >= price);
        (bool success, ) = owner.call{value: msg.value}("");
        require(success);
        owner = msg.sender;
        price = 0;
        emit Purchase(msg.value, msg.sender);
    }
}
