// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

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

    function findWinner() external view returns (Project memory) {
        uint highestAvgRate = 0;
        uint highestProjectIndex = 0;

        for (
            uint projectIndex = 0;
            projectIndex < projects.length;
            projectIndex++
        ) {
            uint projectRateSum = 0;
            uint projectRateCounter = projects[projectIndex].ratings.length;

            if (projectRateCounter < 1) {
                continue;
            }

            for (
                uint256 rateIndex = 0;
                rateIndex < projectRateCounter;
                rateIndex++
            ) {
                projectRateSum += projects[projectIndex].ratings[rateIndex];
            }

            uint projectAvgRate = projectRateSum / projectRateCounter;

            if (projectAvgRate > highestAvgRate) {
                highestProjectIndex = projectIndex;
                highestAvgRate = projectAvgRate;
            }
        }
        return projects[highestProjectIndex];
    }
}
