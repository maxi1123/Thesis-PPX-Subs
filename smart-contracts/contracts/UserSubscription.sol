// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

interface IUsageOracle {
    function activeRate() external view returns (uint256);

    function getUsageFromAddress(address userSubscription)
        external
        view
        returns (uint256);
}

contract UserSubscription {
    modifier onlySubscriber() {
        require(msg.sender == _subscriber, "Only callable by subscriber!");
        _;
    }

    modifier onlyOps() {
        require(msg.sender == _ops, "Only Ops");
        _;
    }

    modifier onlyOracle() {
        require(
            msg.sender == address(_usageOracle),
            "Only callable by oracle!"
        );
        _;
    }

    enum SubscriptionStatus {
        TERMINATED,
        ACTIVE
    }

    Subscription private _activeSubscription;

    address private _subscriber;
    address private _payee;

    IERC777 private _token;

    IUsageOracle private _usageOracle;

    address private immutable _ops = 0xc1C6805B857Bef1f412519C4A842522431aFed39;

    bool private _latestUsageReceived;

    struct Subscription {
        bytes32 id;
        uint256 rate;
        uint256 createdAt;
        uint256 expiresAt;
        SubscriptionStatus status;
    }

    constructor(
        address subscriber,
        address payee,
        IERC777 token,
        address usageOracle
    ) {
        _subscriber = subscriber;
        _payee = payee;
        _token = IERC777(token);
        _usageOracle = IUsageOracle(usageOracle);
        _latestUsageReceived = false;
    }

    function activeSubscription() public view returns (Subscription memory) {
        return _activeSubscription;
    }

    function activeSubscriptionExpiresAt() public view returns (uint256) {
        return _activeSubscription.expiresAt;
    }

    function activeSubscriptionStatus() public view returns (uint8) {
        return uint8(_activeSubscription.status);
    }

    function notifyUsageReceived() external onlyOracle {
        _latestUsageReceived = true;
    }

    function newDailySubscription(uint256 createdAt, uint256 expiresAt)
        public
        onlySubscriber
    {
        require(
            _token.isOperatorFor(address(this), msg.sender),
            "Contract is not an authorized Operator for caller!"
        );
        require(
            createdAt < expiresAt,
            "Subscription cannot expire before creation date!"
        );
        require(
            _activeSubscription.status == SubscriptionStatus.TERMINATED,
            "Subscription already active!"
        );

        bytes32 id = keccak256(
            abi.encodePacked(msg.sender, createdAt, expiresAt)
        );

        uint256 activeRate = _usageOracle.activeRate();

        uint256 collateral = (activeRate * 1440);

        _token.operatorSend(msg.sender, address(this), collateral, "", "");

        _activeSubscription = Subscription(
            id,
            activeRate,
            createdAt,
            expiresAt,
            SubscriptionStatus.ACTIVE
        );
    }

    function distribute() external onlyOps {
        require(
            _activeSubscription.expiresAt < block.timestamp,
            "Subscription has not expired yet."
        );
        uint256 usage = _usageOracle.getUsageFromAddress(address(this));

        if (usage == 0) {
            _token.send(_subscriber, _token.balanceOf(address(this)), "");
        } else {
            uint256 payeePayout = (_activeSubscription.rate * usage);
            uint256 subscriberPayout = _token.balanceOf(address(this)) -
                payeePayout;
            _token.send(_payee, payeePayout, "");
            _token.send(_subscriber, subscriberPayout, "");
        }

        _latestUsageReceived = false;
        _activeSubscription.status = SubscriptionStatus.TERMINATED;
    }

    function checker()
        external
        view
        returns (bool canExec, bytes memory execPayload)
    {
        canExec = _latestUsageReceived;

        execPayload = abi.encodeWithSelector(this.distribute.selector);
    }
}
