// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract OwnedContract {
    address public owner;
    address public charityAddress;

    constructor(address _charityAddress) {
        owner = msg.sender;
        charityAddress = _charityAddress;
    }

    receive() external payable {}

    function tip() external payable {
        require(msg.sender != owner);
        (bool result, ) = owner.call{value: msg.value}("");
        require(result);
    }

    function donate() external payable {
        uint amount = address(this).balance;
        require(amount > 0, "Nothing to send");
        (bool result, ) = charityAddress.call{value: amount}("");
        require(result);
    }
}
