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

    function createVote(Choices choice) external {
        vote = Vote(msg.sender, choice);
    }

    function createVoteInstance(
        Choices choice
    ) external view returns (Vote memory) {
        Vote memory result = Vote(msg.sender, choice);
        return result;
    }
}
