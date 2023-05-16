// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter;
    bool public isApproved;
    event Approved(uint);

    constructor(address _arbiter, address _beneficiary) payable {
        depositor = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
    }

    function approve() external {
        require(msg.sender == arbiter);
        require(!isApproved);
        uint balance = address(this).balance;
        require(balance > 0);
        (bool sent, ) = beneficiary.call{value: balance}("");
        require(sent);
        isApproved = true;
        emit Approved(balance);
    }
}
