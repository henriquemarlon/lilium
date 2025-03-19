// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Token} from "../src/Token.sol";
import {TreeDetector} from "../src/TreeDetector.sol";
import {Script} from "../lib/forge-std/src/Script.sol";

contract Deploy is Script {
    function run() external returns (Token, TreeDetector) {
        address taskIssuerAddress = vm.parseAddress(vm.prompt("Enter Coprocessor address"));
        bytes32 machineHash = vm.parseBytes32(vm.prompt("Enter machine hash"));

        vm.startBroadcast();
        Token token = new Token("Carbon", "CBN");
        TreeDetector treeDetector = new TreeDetector(taskIssuerAddress, machineHash);
        vm.stopBroadcast();

        return (token, treeDetector);
    }
}
