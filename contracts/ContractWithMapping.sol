// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ContractWithMapping {
    mapping(address => bool) public members;

    function addMember(address memberAddress) external {
        require(members[memberAddress] == false);
        members[memberAddress] = true;
    }

    function isMember(address memberAddress) public view returns (bool) {
        return members[memberAddress];
    }
}
