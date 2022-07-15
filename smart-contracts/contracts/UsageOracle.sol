// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISubscriptionStore {
    function notifyUsageReceived(address debtor, address payee) external;
}

contract UsageOracle is Ownable {
    address private _subscriptionStore;
    uint256 private _activeRate;

    mapping(address => mapping(address => uint256)) private _userToPayeeToUsage;

    function activeRate() public view returns (uint256) {
        return _activeRate;
    }

    function updateActiveRate(uint256 newRate) public onlyOwner {
        _activeRate = newRate;
    }

    function subscriptionStore() public view returns (address) {
        return _subscriptionStore;
    }

    function updateSubscriptionStoreAddress(address subStoreAddress)
        public
        onlyOwner
    {
        _subscriptionStore = subStoreAddress;
    }

    function getUsageFromAddress(address debtor, address payee)
        external
        view
        returns (uint256)
    {
        return _userToPayeeToUsage[debtor][payee];
    }

    function setUsage(
        address debtor,
        address payee,
        uint256 usage
    ) public onlyOwner {
        _userToPayeeToUsage[debtor][payee] = usage;
        ISubscriptionStore(_subscriptionStore).notifyUsageReceived(
            debtor,
            payee
        );
    }
}
