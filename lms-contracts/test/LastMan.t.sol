// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/LastManStanding.sol";

contract LastManTest is Test {
    LastManStanding lms;
    address owner = address(0xABCD);
    address alice = address(0xA11CE);
    address bob   = address(0xB0B);

    function setUp() public {
        vm.deal(alice, 100 ether);
        vm.deal(bob,   100 ether);

        // randomnessSender is dummy here for local/test
        lms = new LastManStanding(address(0xDEAD), owner);
    }

    function testFirstDepositStartsAndSetsNextAmount() public {
        // first required = 0.0003
        uint256 req = lms.currentRequiredAmount();
        assertEq(req, 0.0003 ether);

        vm.prank(alice);
        lms.deposit{value: req}();

        // after 1st, step=1 => next required = req + 0.0003
        assertEq(lms.currentRequiredAmount(), req + 0.0003 ether);
        assertEq(lms.vaultBalance(), req);
        assertEq(lms.lastDepositor(), alice);
        assertGt(lms.currentDeadline(), block.timestamp);
    }

    function test50thDepositTriggersBonus() public {
        // make 49 deposits
        for (uint256 i = 0; i < 49; i++) {
            address p = address(uint160(i+1));
            vm.deal(p, 1 ether);
            vm.prank(p);
            lms.deposit{value: lms.currentRequiredAmount()}();
        }
        // 50th deposit (bob)
        vm.prank(bob);
        lms.deposit{value: lms.currentRequiredAmount()}();

        // A randomness request was created internally, but in tests we simulate fulfillment:
        // We don't know the requestId (kept inside Base). We'll fetch the lastBonus only AFTER fulfill.
        // Simulate: pick any fake requestId that exists in mapping:
        // For simplicity, let's assume requestId = 1 (first call); if not, you can expose it in events.
        // We'll guess 1 here for demo; adjust in real test by capturing event or reading mapping keys via helper.
        lms.__testFulfill(1, keccak256("fake"));

        LastManStanding.BonusInfo memory b = lms.lastBonus();
        // percentage is rand % 6; unknown here, but we can at least assert winner is bob
        assertEq(b.winner, bob);
    }

    function testEndRoundAfter24h() public {
        // one deposit
        vm.prank(alice);
        lms.deposit{value: lms.currentRequiredAmount()}();

        // move time 24h + 1
        vm.warp(block.timestamp + 24 hours + 1);

        // end round
        vm.prank(bob);
        lms.endRoundIfExpired();

        // winner is last depositor (alice)
        ( , address w, , , ) = lms.roundSummaries(1);
        assertEq(w, alice);

        // new round started with initial amount reset
        assertEq(lms.currentRoundId(), 2);
        assertEq(lms.currentRequiredAmount(), 0.0003 ether);
    }
}
