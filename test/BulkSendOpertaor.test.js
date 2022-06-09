const BulkSendOperator = artifacts.require ("./BulkSendOperator.sol");
const Erc777AT = artifacts.require("./ERC777AT.sol")

contract('BulkSendOperator', (accounts) =>{
    before(async() =>{
        this.bulkSendOperator = await BulkSendOperator.deployed();
        this.erc777AT = await Erc777AT.deployed();
    })

    it('depolyed succesfully', async() =>{
        const address = await this.bulkSendOperator.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('can send to different accounts', async() =>{
        const recipients = [accounts[1],accounts[2], accounts[3]]
        await this.bulkSendOperator.send(this.erc777AT.address, recipients, 100, 1)
        const account0Balance = await this.erc777AT.balanceOf(accounts[0])
        const account1Balance = await this.erc777AT.balanceOf(accounts[1])
        const account2Balance = await this.erc777AT.balanceOf(accounts[2])
        const account3Balance = await this.erc777AT.balanceOf(accounts[3])


        assert.equal(account0Balance.toNumber(), 9700)
        assert.equal(account1Balance.toNumber(), 100)
        assert.equal(account2Balance.toNumber(), 100)
        assert.equal(account3Balance.toNumber(), 100)
        
    })

})
