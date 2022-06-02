// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";


/**
 * @title BulkSendOperator
 *
 *        An ERC777 token operator contract that provides a number of bulk send
 *        functions
 *
 */
contract BulkSendOperator {
    /**
     * Send a given amount of tokens to multiple recipients
     * @param _token the address of the token contract
     * @param _recipients the list of recipents
     * @param _amount the amount of tokens to send to each recipient
     * @param _data the data to attach to each send
     */
    function send(IERC777 _token, address[] memory _recipients, uint256 _amount, bytes memory _data) public {
        for (uint256 i = 0; i < _recipients.length; i++) {
            _token.operatorSend(msg.sender, _recipients[i], _amount, _data, "");
        }
    }

    /**
     * Send individual amounts of tokens to multiple recipients
     * @param _token the address of the token contract
     * @param _recipients the list of recipents
     * @param _amounts the amount of tokens to send to each recipient
     * @param _data the data to attach to each send
     */
    function sendAmounts(IERC777 _token, address[] memory _recipients, uint256[] memory _amounts, bytes memory _data) public {
        for (uint256 i = 0; i < _recipients.length; i++) {
            _token.operatorSend(msg.sender, _recipients[i], _amounts[i], _data, "");
        }
    }
}