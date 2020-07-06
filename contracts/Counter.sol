// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

// Replace for Remix
// import "https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/GSN/GSNRecipient.sol";
// Use At Address() in Remix;
import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";

contract Counter is GSNRecipientUpgradeSafe {
    uint256 public value;

    address private _owner;

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    constructor() public initializer {
        _owner = msg.sender;
        __GSNRecipient_init();
    }

    function increase() public {
        value += 1;
    }

    function deposit() external payable {
        IRelayHub(getHubAddr()).depositFor(address(this));
    }

    function withdraw(uint256 amount, address payable payee)
        external
        payable
        onlyOwner
    {
        _withdrawDeposits(amount, payee);
    }

    function acceptRelayedCall(
        address relay,
        address from,
        bytes calldata encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce,
        bytes calldata approvalData,
        uint256 maxPossibleCharge
    ) external override view returns (uint256, bytes memory) {
        (
            relay,
            from,
            encodedFunction,
            transactionFee,
            gasPrice,
            gasLimit,
            nonce,
            approvalData,
            maxPossibleCharge
        );
        return _approveRelayedCall();
    }

    // We won't do any pre or post processing, so leave _preRelayedCall and _postRelayedCall empty
    function _preRelayedCall(bytes memory context)
        internal
        override
        returns (bytes32)
    {}

    function _postRelayedCall(
        bytes memory context,
        bool,
        uint256 actualCharge,
        bytes32
    ) internal override {}
}
