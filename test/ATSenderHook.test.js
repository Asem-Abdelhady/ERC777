const { singletons, BN, expectEvent } = require('@openzeppelin/test-helpers');

const Erc777AT = artifacts.require('ERC777AT.sol');
const SenderHook = artifacts.require('ATSenderHook.sol');

contract('ATSenderHook', function (accounts, registryFunder, creator) {
  const data = web3.utils.sha3('777TestData');

  before(async function () {
    this.erc1820 = await singletons.ERC1820Registry(registryFunder);
    this.erc777AT = await Erc777AT.deployed();
    this.ATsenderHook = await SenderHook.deployed();
  });

  it('sends from an externally-owned account', async function () {
    const amount = new BN(2)
    const tokensSenderInterfaceHash = await this.ATsenderHook.TOKENS_SENDER_INTERFACE_HASH();
    await this.ATsenderHook.senderFor(accounts[0])
    await this.erc1820.setInterfaceImplementer(accounts[0], tokensSenderInterfaceHash, this.ATsenderHook.address, { from: accounts[0] });
    const receipt = await this.erc777AT.send(accounts[1], amount, data, { from: accounts[0] });
    await expectEvent.inTransaction(receipt.tx, SenderHook, 'DoneStuff', { from: accounts[0], to: accounts[1], amount: amount, userData: data, operatorData: null });


    const recipientBalance = await this.erc777AT.balanceOf(accounts[1]);
    assert.equal(recipientBalance.toNumber(), amount.toNumber())

  });
});