// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./UserSubscription.sol";

contract SubscriptionStore is Ownable {
    address private _usageOracle;

    IERC777 private _token;

    mapping(address => address) private _userToSubscription;

    constructor(address tokenAddress) {
        _token = IERC777(tokenAddress);
    }

    function usageOracle() public view returns (address) {
        require(_usageOracle != address(0), "Oracle address has not been set!");
        return _usageOracle;
    }

    function token() public view returns (address) {
        return address(_token);
    }

    function subscriptionFromUser(address userAddress)
        public
        view
        returns (address)
    {
        require(
            _userToSubscription[userAddress] != address(0),
            "User with address has no subscription contract!"
        );

        return _userToSubscription[userAddress];
    }

    function setUsageOracle(address oracleAddress) public onlyOwner {
        _usageOracle = oracleAddress;
    }

    function registerUser() public returns (address) {
        require(_usageOracle != address(0), "Oracle address has not been set!");
        require(
            _userToSubscription[msg.sender] == address(0),
            "Caller already has an active subscription contract!"
        );

        address newUserSubscription = address(
            new UserSubscription(
                msg.sender,
                address(this),
                _token,
                _usageOracle
            )
        );
        _userToSubscription[msg.sender] = newUserSubscription;
        return newUserSubscription;
    }
}
