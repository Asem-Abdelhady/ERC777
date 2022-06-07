const Erc777AT = artifacts.require("./ERC777AT.sol");
const StaticSale = artifacts.require("./StaticSale.sol")
const BulkSendOperator = artifacts.require("./BulkSendOperator.sol")


module.exports = async function (deployer, network, accounts) {
    deployer.deploy(StaticSale).then(function () {
        return deployer.deploy(BulkSendOperator).then(function () {
            return deployer.deploy(Erc777AT, [BulkSendOperator.address, StaticSale.address]);

        })
    });



};
