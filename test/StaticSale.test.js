const Web3 = require("web3");
const Erc777AT = artifacts.require("./ERC777AT.sol")
const StaticSale = artifacts.require("./StaticSale.sol")

const ganache = require("ganache");
const assert = require("assert");

const web3 = new Web3(ganache.provider());
const gran = web3.utils.toBN(10**18)

contract("StaticSale", (accounts) =>{
    before(async()=>{
        this.erc777AT = await Erc777AT.deployed()
        this.staticSale = await StaticSale.deployed()
    })

    it("deployed succesfully", async()=>{
        const address = await this.erc777AT.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it("Set the token price", async() =>{
        const ercAddress = this.erc777AT.address
        const tokenPrice = web3.utils.toWei('0.2', 'ether');
        await this.staticSale.setPricePerToken(ercAddress, tokenPrice, {from: accounts[0]})
        const staticPrice = await this.staticSale.getPricePerToken(ercAddress, accounts[0])
        assert.equal(tokenPrice, staticPrice)

    })

    it("Can send tokens with ether", async()=>{
        const ercAddress = await this.erc777AT.address
        await this.staticSale.send(ercAddress, accounts[0], {from: accounts[1], value: web3.utils.toWei('2','ether')})
        const account0Balance = await this.erc777AT.balanceOf(accounts[0])
        const account1Balance = await this.erc777AT.balanceOf(accounts[1])

        assert.equal(account0Balance.div(gran), 9990)
        assert.equal(account1Balance.div(gran), 10)
    })
})