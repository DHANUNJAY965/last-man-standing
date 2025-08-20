/// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";

contract MockRandomnessReceiver is RandomnessReceiverBase {
    bytes32 public randomness;
    uint256 public requestId;

    constructor(address randomnessSender, address owner)
        RandomnessReceiverBase(randomnessSender, owner) {}

    function generateWithDirectFunding(uint32 callbackGasLimit)
        external
        payable
        returns (uint256, uint256)
    {
        (uint256 requestID, uint256 requestPrice) = _requestRandomnessPayInNative(callbackGasLimit);
        requestId = requestID;
        return (requestID, requestPrice);
    }

    function generateWithSubscription(uint32 callbackGasLimit) external returns (uint256) {
        uint256 requestID = _requestRandomnessWithSubscription(callbackGasLimit);
        requestId = requestID;
        return requestID;
    }

    function cancelSubscription(address to) external onlyOwner {
        _cancelSubscription(to);
    }

    function onRandomnessReceived(uint256 requestID, bytes32 _randomness) internal override {
        require(requestId == requestID, "Request ID mismatch");
        randomness = _randomness;
    }
}
