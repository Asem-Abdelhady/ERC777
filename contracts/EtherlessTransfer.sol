// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

contract EtherlessTransfer {
    // Mapping is hash=>used, to stop replays
    mapping(bytes32=>bool) private usedHashes;

    /**
     * send tokens from one account to another using the signature as the authority.
     * The signature is created by the holder and signs a hash of the
     * (_token, _holder, _recipient, _amount, _nonce) tuple as created by hashForSend().
     *
     * @param _token the address of the token contract
     * @param _holder the holder of the tokens
     * @param _recipient the recipient of the tokens
     * @param _amount the number of tokens to send
     * @param _data the data field for the operatorSend operation, supplied by the authority
     * @param _nonce a unique field for a given (_token, _holder, _recipient, _amount, _nonce) supplied by the authority
     * @param _signature the signature supplied by the authority
     */
    function send(IERC777 _token, address _holder, address _recipient, uint256 _amount, bytes memory _data, uint256 _nonce, bytes memory _signature) public {
        preSend(_token, _holder, _recipient, _amount, _data, _nonce, _signature);
        _token.operatorSend(_holder, _recipient, _amount, _data, "");
    }

    function preSend(IERC777 _token, address _holder, address _recipient, uint256 _amount, bytes memory _data, uint256 _nonce, bytes memory _signature) internal {
        // Ensure that signature contains the correct number of bytes
        require(_signature.length == 65, "length of signature incorrect");

        bytes32 hash = hashForSend(_token, _holder, _recipient, _amount, _data, _nonce);
        require(!usedHashes[hash], "tokens already sent");

        address signatory = signer(hash, _signature);
        require(signatory != address(0), "signatory is invalid");
        require(signatory == _holder, "signatory is not the holder");
        usedHashes[hash] = true;
    }

    /**
     * This generates the hash that is signed by the holder to authorise a send.
     *
     * @param _token the address of the token contract
     * @param _holder the holder of the tokens
     * @param _recipient the recipient of the tokens
     * @param _amount the number of tokens to send
     * @param _data the data field for the operatorSend operation, supplied by the authority
     * @param _nonce a unique field for a given (_token, _holder, _recipient, _amount, _nonce) supplied by the authority
     */
    function hashForSend(IERC777 _token, address _holder, address _recipient, uint256 _amount, bytes memory _data, uint256 _nonce) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_token, _holder, _recipient, _amount, _data, _nonce));
    }

    /**
     * This obtains the signer of a hash given its signature.
     * Note that a returned address of 0 means that the signature is invalid,
     * and should be treated as such.
     */
    function signer(bytes32 _hash, bytes memory _signature) private pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := and(mload(add(_signature, 65)), 255)
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "signature is invalid");

        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, _hash));
        return ecrecover(prefixedHash, v, r, s);
    }
}
