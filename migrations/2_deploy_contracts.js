const Erc777AT = artifacts.require("./ERC777AT.sol");
const StaticSale = artifacts.require("./StaticSale.sol")
const BulkSendOperator = artifacts.require("./BulkSendOperator.sol")
const ATSenderHook = artifacts.require("./ATSenderHook.sol")
const ATRecipientHook = artifacts.require("./ATRecipientHook.sol")
const EtherlessTransfer = artifacts.require("./EtherlessTransfer")

require('@openzeppelin/test-helpers/configure')({provider: web3.currentProvider, environment: 'truffle'});
const {singletons} = require('@openzeppelin/test-helpers');


module.exports = async function (deployer, network, accounts) {
    deployer.deploy(ATSenderHook);
    deployer.deploy(StaticSale).then(function () {
        return deployer.deploy(BulkSendOperator).then(function () {
            return deployer.deploy(EtherlessTransfer).then(function(){
                return deployer.deploy(Erc777AT, [BulkSendOperator.address, StaticSale.address, EtherlessTransfer.address]).then(function () {
                    return deployer.deploy(ATRecipientHook, Erc777AT.address)
                })
            })
        })
    });


};  
