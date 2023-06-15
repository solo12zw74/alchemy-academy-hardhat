// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MultiSigontract {
    address[] public owners;
    uint256 public required;

    struct Transaction {
        address destination;
        uint256 amount;
        bool executed;
    }

    mapping (uint=>Transaction) public transactions;
    uint public transactionCount;

    constructor(address[] memory _owners, uint256 _required) {
        require(checkOwnerAddress(_owners, msg.sender));
        require(_required > 0);
        require(_required < _owners.length);

        owners = _owners;
        required = _required;
    }

    function checkOwnerAddress(
        address[] memory _owners,
        address owner
    ) private pure returns (bool) {
        for (uint i = 0; i < _owners.length; i++) {
            if (_owners[i] == owner) {
                return true;
            }
        }
        return false;
    }
}
