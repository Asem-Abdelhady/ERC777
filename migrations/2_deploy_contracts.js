const Erc777AT = artifacts.require("./ERC777AT.sol");
const StaticSale = artifacts.require("./StaticSale.sol")
const BulkSendOperator = artifacts.require("./BulkSendOperator.sol")

require('@openzeppelin/test-helpers/configure')({ provider: web3.currentProvider, environment: 'truffle' });
const { singletons } = require('@openzeppelin/test-helpers');



module.exports = async function (deployer, network, accounts) {
    deployer.deploy(StaticSale).then(function () {
        return deployer.deploy(BulkSendOperator).then(function () {
            return deployer.deploy(Erc777AT,10000, [BulkSendOperator.address, StaticSale.address]);

        })
    });



};  
