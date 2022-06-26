// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title FixedPriceSeller
 *
 *        An ERC777 token operator contract that sells tokens at a fixed price.
 *
 */

contract StaticSale {

    using SafeMath for uint256;

    // Mapping is token=>holder=>price per token
    mapping(address => mapping(address => uint256)) pricePerToken;


    event PricePerToken(address token, address holder, uint256 pricePerToken);

    /**
     * Set the price for each token.  The price is in Wei, so if for example
     * the price is 1 Ether for 1 token then _pricePerToken would be 10^18.
     */
    function setPricePerToken(IERC777 _token, uint256 _pricePerToken) public {
        pricePerToken[address(_token)][msg.sender] = _pricePerToken;
        emit PricePerToken(address(_token), msg.sender, _pricePerToken);
    }

    /**
     * Get the price for each token.  The price is in Wei, so if for example
     * the price is 1 Ether for 1 token this would return 10^18.
     */
    function getPricePerToken(IERC777 _token, address _holder) public view returns (uint256) {
        return pricePerToken[address(_token)][_holder];
    }

    /**
     * Send tokens from a holder at their price
     */
    function send(IERC777 _token, address payable _holder) public payable {
        uint256 amount = preSend(_token, _holder);
        _token.operatorSend(_holder, msg.sender, amount, "", "");
        postSend(_holder);
    }

    /**
     * Checks and state update to carry out prior to sending tokens
     */
    function preSend(IERC777 _token, address _holder) internal view returns (uint256) {
        require(pricePerToken[address(_token)][_holder] != 0, "not for sale");
        uint256 amount = msg.value.mul(1).div(pricePerToken[address(_token)][_holder]);
        require(amount > _token.granularity(), "not enough ether paid");
        uint256 value = amount.mul(pricePerToken[address(_token)][_holder]).div(1);
        require(value == msg.value, "non-integer number of tokens purchased");
        return amount;
    }

    /**
     * State update to carry out after sending tokens
     */
    function postSend(address payable _holder) internal {
        _holder.transfer(msg.value);
    }
}
