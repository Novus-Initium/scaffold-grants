// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

interface IRoundFactory {
    function initialize() external;

    function updateAlloSettings(address newAlloSettings) external;

    function updateRoundImplementation(
        address payable newRoundImplementation
    ) external;

    function create(
        bytes calldata encodedParameters,
        address ownedBy,
        string calldata roundMetaPointer
    ) external returns (address);
}
