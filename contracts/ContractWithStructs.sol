// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ContractWithStructs {
    enum Choices {
        Yes,
        No
    }

    struct Vote {
        address Voter;
        Choices Choise;
    }

    Vote public vote;
    Vote none = Vote(address(0), Choices(0));

    Vote[] public votes;

    function createVote(Choices choice) external {
        vote = Vote(msg.sender, choice);
    }

    function createVoteInstance(
        Choices choice
    ) external view returns (Vote memory) {
        Vote memory result = Vote(msg.sender, choice);
        return result;
    }

    function createVoteInStore(Choices choice) external {
        Vote memory result = Vote(msg.sender, choice);
        votes.push(result);
    }

    function findVote(address addr) private view returns (Vote storage) {
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].Voter == addr) {
                return votes[i];
            }
        }
        return none;
    }

    function hasVoted(address addr) external view returns (bool) {
        Vote memory v = findVote(addr);
        return v.Voter == addr;
    }

    function findChoice(address addr) external view returns (Choices) {
        Vote memory v = findVote(addr);
        if (v.Voter == addr) {
            return v.Choise;
        }
        return Choices.No;
    }

    function changeVote(Choices choice) external {
        Vote storage v = findVote(msg.sender);
        require(v.Voter != none.Voter);
        v.Choise = choice;
    }
}
