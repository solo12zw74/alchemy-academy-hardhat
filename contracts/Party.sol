// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Party {
    uint deposit = 0;
    // keep track of all attendees
    mapping(address => uint) attendees;

    constructor(uint256 _deposit) {
        require(_deposit > 0);
        deposit = _deposit;
    }

    function rsvp() external payable {
        require(msg.value == deposit);
        require(attendees[msg.sender] == 0);
        attendees[msg.sender] = msg.value;
    }
}
