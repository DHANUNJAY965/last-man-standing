// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import {LastManStanding} from "../src/LastManStanding.sol";

contract DeployScript is Script {
    function run() external {
        address RANDOMNESS_SENDER = vm.envAddress("DCIPHER_RANDOMNESS_SENDER"); // prod only
        address OWNER = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast();

        // For local testing, if you don't have a sender, you can pass your own EOA,
        // because you won't use the real callback. You'll use __testFulfill.
        LastManStanding lms = new LastManStanding(RANDOMNESS_SENDER, OWNER);

        vm.stopBroadcast();

        console2.log("LMS deployed at:", address(lms));
    }
}
