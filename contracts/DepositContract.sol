// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IAccountRegistry.sol";

contract DepositContract {
    uint private minDepositAmount = 1 ether;
    uint public depositAmount;
    address private owner;
    address private accountRegistry;

    constructor(address _accountRegistry) payable {
        require(
            msg.value >= minDepositAmount,
            "Amont must be greater than or equal of 1 ether"
        );
        depositAmount = msg.value;
        owner = msg.sender;
        accountRegistry = _accountRegistry;
    }

    function withdraw() external onlyOwner {
        uint amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw");
        require(IAccountRegistry(accountRegistry).checkAccount(owner));
        (bool isSuccess, ) = owner.call{value: amount}("");
        require(isSuccess);
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner can withdraw");
        _;
    }
}
