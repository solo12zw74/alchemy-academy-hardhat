// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Hackathon {
    struct Project {
        string title;
        uint[] ratings;
    }

    Project[] projects;

    // TODO: add the findWinner function

    function newProject(string calldata _title) external {
        // creates a new project with a title and an empty ratings array
        projects.push(Project(_title, new uint[](0)));
    }

    function rate(uint _idx, uint _rating) external {
        // rates a project by its index
        projects[_idx].ratings.push(_rating);
    }
}
