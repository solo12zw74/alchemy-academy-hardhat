// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ContractWithMapping {
    struct User {
        uint balance;
        bool isActive;
    }

    enum ConnectionTypes {
        Unacquainted,
        Friend,
        Family
    }

    mapping(address => mapping(address => ConnectionTypes)) public connections;

    mapping(address => User) public users;

    mapping(address => bool) public members;

    function addMember(address memberAddress) external {
        require(members[memberAddress] == false);
        members[memberAddress] = true;
    }

    function isMember(address memberAddress) external view returns (bool) {
        return members[memberAddress];
    }

    function removeMember(address memberAddress) external {
        members[memberAddress] = false;
    }

    function createUser() external {
        require(users[msg.sender].isActive == false);
        User memory user = User({balance: 100, isActive: true});
        users[msg.sender] = user;
    }

    function transfer(address recepientAddress, uint amount) external {
        User storage sender = users[msg.sender];
        User storage recepient = users[recepientAddress];

        require(sender.isActive == true);
        require(recepient.isActive == true);
        require(sender.balance >= amount);
        recepient.balance += amount;
        sender.balance -= amount;
        require(sender.balance >= 0);
    }

    function connectWith(
        address other,
        ConnectionTypes connectionType
    ) external {
        connections[msg.sender][other] = connectionType;
    }
}
