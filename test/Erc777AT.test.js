const Erc777AT= artifacts.require ("./ERC777AT.sol");
const { expectEvent, singletons, constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

// const Web3 = require("web3");
// const ganache = require("ganache");

// const web3 = new Web3(ganache.provider());
// const contractJson = require('./build/contracts/ERC777AT.json')

contract('ERC777AT',  (accounts,registryFunder,creator) =>{
    before(async() =>{
        this.erc1820 = await singletons.ERC1820Registry(registryFunder);
        this.erc777AT = await Erc777AT.deployed()})

    it('depolyed succesfully', async() =>{
        const address = await this.erc777AT.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('token supply same as balance of creator', async() =>{
        const balance = await this.erc777AT.balanceOf(accounts[0])
        const tokenSupply = await this.erc777AT.totalSupply()
        assert.equal(balance.toNumber(), tokenSupply.toNumber())
    })

    it('transferred succesfully', async() =>{
        await this.erc777AT.transfer(accounts[1], 100,{from: accounts[0]})
        
        const account0Balance = await this.erc777AT.balanceOf(accounts[0])
        const account1Balance = await this.erc777AT.balanceOf(accounts[1])
        
        assert.equal(account0Balance.toNumber(), 9900)
        assert.equal(account1Balance.toNumber(),100)

    })

})