// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract StackClub {
    address[] public members;

    constructor() {
        members.push(msg.sender);
    }

    function addMember(address member) external {
        members.push(member);
    }

    function isMember(address member) external view returns (bool) {
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == member) {
                return true;
            }
        }
        return false;
    }

    function removeLastMember() external {
        members.pop();
    }
}
