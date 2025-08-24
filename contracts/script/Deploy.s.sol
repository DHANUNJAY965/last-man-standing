// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/LastManStanding.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Base Sepolia addresses for dcipher services
        address randomnessSender = 0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779;
        address blocklockSender = 0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e;
        
        vm.startBroadcast(deployerPrivateKey);
        
        LastManStanding game = new LastManStanding(
            randomnessSender,
            blocklockSender
        );
        
        vm.stopBroadcast();
        
        console.log("LastManStanding deployed to:", address(game));
        console.log("Randomness Sender:", randomnessSender);
        console.log("Blocklock Sender:", blocklockSender);
        console.log("Current Round ID:", game.currentRoundId());
        
        // Log the current round details
        try game.getCurrentRound() returns (LastManStanding.Round memory round) {
            console.log("Round started:", round.startTime);
            console.log("Next deposit amount:", round.nextDepositAmount);
        } catch {
            console.log("Could not fetch round details");
        }
    }
}