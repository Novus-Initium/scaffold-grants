// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

interface IVotingStrategyFactory {
    function initialize() external;

    function updateVotingContract(
        address newVotingContract
    ) external;

    function create() external returns (address);
}