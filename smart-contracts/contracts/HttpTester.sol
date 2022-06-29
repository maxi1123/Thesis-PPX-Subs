// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./provableAPI.sol";

contract HttpTester is usingProvable {
    string public ETHUSD;

    event LogNewProvableQuery(string description);
    event LogResult(string result);
    event LogPriceUpdated(string price);

    function __callback(bytes32 myid, string memory result) public override {
        if (msg.sender != provable_cbAddress()) revert();
        ETHUSD = result;
        emit LogPriceUpdated(result);
    }

    function getUsageData() public payable {
        if (provable_getPrice("computation") > address(this).balance) {
            emit LogNewProvableQuery(
                "Provable query was NOT sent, please add some ETH to cover for the query fee"
            );
        } else {
            emit LogNewProvableQuery(
                "Provable query was sent, standing by for the answer..."
            );
            provable_query("URL", "https://jsonplaceholder.typicode.com/posts/1");
        }
    }
}
