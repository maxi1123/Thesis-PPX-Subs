// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IUserSubscription {
    function notifyUsageReceived() external;

    function activeSubscriptionExpiresAt() external view returns (uint256);

    function activeSubscriptionStatus() external view returns (uint8);
}

contract UsageOracle is Ownable {
    mapping(address => uint256) private _subscriptionAddressToUsage;

    uint256 private _activeRate;

    function activeRate() public view returns (uint256) {
        return _activeRate;
    }

    function updateActiveRate(uint256 newRate) public onlyOwner {
        _activeRate = newRate;
    }

    function setUsage(address userSubscription, uint256 usage)
        public
        onlyOwner
    {
        require(
            IUserSubscription(userSubscription).activeSubscriptionExpiresAt() <
                block.timestamp &&
                IUserSubscription(userSubscription)
                    .activeSubscriptionStatus() ==
                1,
            "Subscription must have expired and must have status active!"
        );

        _subscriptionAddressToUsage[userSubscription] = usage;
        IUserSubscription(userSubscription).notifyUsageReceived();
    }

    function getUsageFromAddress(address userSubscription)
        external
        view
        returns (uint256)
    {
        return _subscriptionAddressToUsage[userSubscription];
    }
}
