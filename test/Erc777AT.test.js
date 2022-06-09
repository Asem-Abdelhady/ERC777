const Erc777AT= artifacts.require ("./ERC777AT.sol");
const BulkSendOperator = artifacts.require("./BulkSendOperator.sol")
const StaticSale = artifacts.require("./StaticSale.sol")
const { expectEvent, singletons, constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

// const Web3 = require("web3");
// const ganache = require("ganache");

// const web3 = new Web3(ganache.provider());
// const contractJson = require('./build/contracts/ERC777AT.json')

contract('ERC777AT',  (accounts,registryFunder,creator) =>{
    before(async() =>{
        this.erc1820 = await singletons.ERC1820Registry(registryFunder);
        this.erc777AT = await Erc777AT.deployed()
        this.bulkSendOperator = await BulkSendOperator.deployed()
        this.staricSale = await StaticSale.deployed()})

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

    it('can send tokens', async() =>{
        await this.erc777AT.send(accounts[1], 100,1,{from: accounts[0]})

        const account0Balance = await this.erc777AT.balanceOf(accounts[0])
        const account1Balance = await this.erc777AT.balanceOf(accounts[1])
        
        assert.equal(account0Balance.toNumber(), 9800)
        assert.equal(account1Balance.toNumber(),200)

    })

    it('the operators are the same', async()=>{

        const operators = await this.erc777AT.defaultOperators()
        const bulkAddress = await this.bulkSendOperator.address
        const staticAddress = await this.staricSale.address
        
        assert.equal(operators[0], bulkAddress)
        assert.equal(operators[1], staticAddress)
    })

    it('is operator working', async()=>{
        const bulkAddress = await this.bulkSendOperator.address
        const isOperator = await this.erc777AT.isOperatorFor(bulkAddress,accounts[0])
        assert.equal(isOperator, true)  
    })

    it("the right metadata", async()=>{
        const name = await this.erc777AT.name();
        const symbol = await this.erc777AT.symbol();

        assert.equal(symbol, 'AT')
        assert.equal(name,'AsemToken')
    })

})