// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DepositContract {
    uint private minDepositAmount = 1 ether;
    uint public depositAmount;
    address private owner;

    constructor() payable {
        require(
            msg.value >= minDepositAmount,
            "Amont must be greater than or equal of 1 ether"
        );
        depositAmount = msg.value;
        owner = msg.sender;
    }

    function withdraw() external onlyOwner {
        uint amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw");
        (bool isSuccess, ) = owner.call{value: amount}("");
        require(isSuccess);
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner can withdraw");
        _;
    }
}
