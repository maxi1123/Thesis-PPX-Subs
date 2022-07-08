// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUsageOracle {
    function activeRate() external view returns (uint256);

    function getUsageFromAddress(address debtor, address payee)
        external
        view
        returns (uint256);
}

contract SubscriptionStore is Ownable {
    enum SubscriptionStatus {
        INACTIVE,
        ACTIVE,
        TERMINATED
    }

    modifier onlyOracle() {
        require(
            msg.sender == address(_usageOracle),
            "Only callable by oracle!"
        );
        _;
    }

    address private _usageOracle;

    IERC777 private _token;

    mapping(address => mapping(address => Subscription))
        private _userToPayeeToSubscription;

    mapping(address => mapping(address => uint256))
        private _userToPayeeToLockedTokens;

    struct Subscription {
        bytes32 id;
        address payee;
        uint256 rate;
        uint256 createdAt;
        uint256 expiresAt;
        SubscriptionStatus status;
    }

    constructor(address tokenAddress_, address usageOracle_) {
        _token = IERC777(tokenAddress_);
        _usageOracle = usageOracle_;
    }

    function usageOracle() public view returns (address) {
        return _usageOracle;
    }

    function token() public view returns (address) {
        return address(_token);
    }

    function activeSubscriptionFromUser(address userAddress, address payee)
        public
        view
        returns (Subscription memory)
    {
        require(
            _userToPayeeToSubscription[userAddress][payee].payee != address(0),
            "User with address has no subscription contract!"
        );

        return _userToPayeeToSubscription[userAddress][payee];
    }

    function lockedTokensFromUser(address userAddress, address payee)
        public
        view
        returns (uint256)
    {
        return _userToPayeeToLockedTokens[userAddress][payee];
    }

    function notifyUsageReceived(address debtor, address payee)
        external
        onlyOracle
    {
        _distribute(debtor, payee);
    }

    function newDailySubscription(
        address payee,
        uint256 createdAt,
        uint256 expiresAt
    ) public returns (Subscription memory) {
        require(
            _token.isOperatorFor(address(this), msg.sender),
            "Contract is not an authorized Operator for caller!"
        );
        require(
            _userToPayeeToSubscription[msg.sender][payee].status ==
                SubscriptionStatus.INACTIVE,
            "Subscription already active!"
        );

        bytes32 id = keccak256(
            abi.encodePacked(msg.sender, payee, createdAt, expiresAt)
        );

        uint256 activeRate = IUsageOracle(_usageOracle).activeRate();

        uint256 collateral = (activeRate * 1440);

        _token.operatorSend(msg.sender, address(this), collateral, "", "");

        _userToPayeeToSubscription[msg.sender][payee] = Subscription(
            id,
            payee,
            activeRate,
            createdAt,
            expiresAt,
            SubscriptionStatus.ACTIVE
        );

        _userToPayeeToLockedTokens[msg.sender][payee] = collateral;

        return _userToPayeeToSubscription[msg.sender][payee];
    }

    function _distribute(address debtor, address payee) private {
        require(
            _userToPayeeToSubscription[debtor][payee].expiresAt <
                block.timestamp,
            "Subscription has not expired yet."
        );
        uint256 usage = IUsageOracle(_usageOracle).getUsageFromAddress(
            debtor,
            payee
        );

        if (usage == 0) {
            _token.send(debtor, _userToPayeeToLockedTokens[debtor][payee], "");
            _userToPayeeToLockedTokens[debtor][payee] = 0;
        } else {
            uint256 payeePayout = (_userToPayeeToSubscription[debtor][payee]
                .rate * usage);
            uint256 subscriberPayout = _userToPayeeToLockedTokens[debtor][
                payee
            ] - payeePayout;
            _token.send(payee, payeePayout, "");
            _token.send(debtor, subscriberPayout, "");
            _userToPayeeToLockedTokens[debtor][payee] = 0;
        }
        _userToPayeeToSubscription[debtor][payee].status = SubscriptionStatus
            .TERMINATED;
    }
}
