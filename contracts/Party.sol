// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Party {
    uint public depositAmount = 0;
    // keep track of all attendees
    mapping(address => bool) attendees;
    uint contractFunds = 0;
    address[] attendeesArray;

    constructor(uint256 _deposit) {
        require(_deposit > 0);
        depositAmount = _deposit;
    }

    function rsvp() external payable {
        require(msg.value == depositAmount);
        require(attendees[msg.sender] == false);
        attendees[msg.sender] = true;
        contractFunds += msg.value;
        attendeesArray.push(msg.sender);
    }

    function payBill(address venue, uint totalAmount) external {
        require(totalAmount <= contractFunds);
        (bool success, ) = venue.call{value: totalAmount}("");
        require(success);
        if (contractFunds == totalAmount) {
            return;
        }

        uint totalRemainder = contractFunds - totalAmount;
        uint attendeesCount = attendeesArray.length;
        uint remainder = totalRemainder / attendeesCount;
        for (uint256 index = 0; index < attendeesCount; index++) {
            address attendee = attendeesArray[index];
            (bool successRemainderSend, ) = attendee.call{value: remainder}("");
            require(successRemainderSend);
        }
    }
}
