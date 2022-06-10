const { singletons, BN, expectEvent } = require('@openzeppelin/test-helpers');

const Erc777AT = artifacts.require('ERC777AT.sol');
const RecipientHook = artifacts.require('ATRecipientHook.sol');

contract('ATRecipientHook', function (accounts, registryFunder, creator) {
    const data = web3.utils.sha3('777TestData');
  
    before(async function () {
      this.erc1820 = await singletons.ERC1820Registry(registryFunder);
      this.erc777AT = await Erc777AT.deployed();
      this.ATrecipientHook = await RecipientHook.deployed();
    });
  
    it('sends to a contract from an externally-owned account', async function () {
      const amount = new BN(2)
      const receipt = await this.erc777AT.send(this.ATrecipientHook.address, amount, data, { from: accounts[0] });
      await expectEvent.inTransaction(receipt.tx, RecipientHook, 'DoneStuff', { from: accounts[0], to: this.ATrecipientHook.address, amount: amount, userData: data, operatorData: null });
  
  
      const recipientBalance = await this.erc777AT.balanceOf(this.ATrecipientHook.address);
      assert.equal(recipientBalance.toNumber(), amount.toNumber())
  
    });
  });