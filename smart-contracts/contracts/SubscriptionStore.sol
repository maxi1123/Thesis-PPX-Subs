// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./UserSubscription.sol";
import "./OpsReady.sol";

interface InterfaceOps {
    function createTask(
        address _execAddress,
        bytes4 _execSelector,
        address _resolverAddress,
        bytes calldata _resolverData
    ) external returns (bytes32 task);

    function cancelTask(bytes32 _taskId) external;
}

interface IUserSubscription {
    function distribute() external;

    function checker()
        external
        view
        returns (bool canExec, bytes memory execPayload);
}

contract SubscriptionStore is Ownable, OpsReady {
    address private immutable _ETH_ADDRESS =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address private immutable _taskTreasury =
        0x0af13072280E10907911ce5d046c2DfA1B604d23;

    address private _usageOracle;

    IERC777 private _token;

    mapping(address => address) private _userToSubscription;

    constructor(address payable _ops, address tokenAddress) OpsReady(_ops) {
        _token = IERC777(tokenAddress);
    }

    function ETH_ADDRESS() public view returns (address) {
        return _ETH_ADDRESS;
    }

    function taskTreasury() public view returns (address) {
        return _taskTreasury;
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

    function createTaskForUser(address userSubscriptionAddress)
        public
        onlyOwner
        returns (bytes32)
    {
        bytes32 taskId = InterfaceOps(ops).createTask(
            userSubscriptionAddress,
            IUserSubscription(userSubscriptionAddress).distribute.selector,
            userSubscriptionAddress,
            abi.encodeWithSelector(
                IUserSubscription(userSubscriptionAddress).checker.selector
            )
        );
        return taskId;
    }

    function _cancelTaskForUser(bytes32 taskId) public onlyOwner {
        InterfaceOps(ops).cancelTask(taskId);
    }
}
