const Erc777AT = artifacts.require("./ERC777AT.sol");
const StaticSale = artifacts.require("./StaticSale.sol")
const BulkSendOperator = artifacts.require("./BulkSendOperator.sol")
module.exports = function (deployer) {
    deployer.deploy(StaticSale);
    deployer.deploy(BulkSendOperator);
    deployer.deploy(Erc777AT,10000,[BulkSendOperator.address,StaticSale.address]);
};
