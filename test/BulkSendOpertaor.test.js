const BulkSendOperator = artifacts.require ("./BulkSendOperator.sol");

contract('BulkSendOperator', (accounts) =>{
    before(async() =>{
        this.bulkSendOperator = await BulkSendOperator.deployed();
    })

    it('depolyed succesfully', async() =>{
        const address = await this.bulkSendOperator.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

})
