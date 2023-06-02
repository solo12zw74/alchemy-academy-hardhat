// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DeadmanSwitch {
    uint amount;
    address owner;
    address beneficiary;
    uint lastPingDate;

    constructor(address _beneficiary) payable {
        require(msg.value > 0);
        amount = msg.value;
        owner = msg.sender;
        beneficiary = _beneficiary;
        lastPingDate = block.timestamp;
    }

    function ping() external {
        require(msg.sender == owner);
        lastPingDate = block.timestamp;
    }

    function withdraw() external {
        uint timeDifference = block.timestamp - lastPingDate;
        require(timeDifference > 52 weeks);
        (bool success, ) = beneficiary.call{value: amount}("");
        require(success);
    }
}
