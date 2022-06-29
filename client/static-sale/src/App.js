import './App.css';
import React, {Component} from "react";
import Web3 from "web3";
import Loading from "./Loading";
import BuyATForm from "./BuyATForm";
import AmountToBuyText from "./AmountToBuyText";
import {ERC777AT_ABI, ERC777AT_ADDRESS, STATICSALE_ADDRESS, STATICSALE_API} from "./config";
import TokensPurchaseConfirmationModal from "./Modals/TokensPurchaseConfirmationModal";
import NotEnoughEthersModal from "./Modals/NotEnoughEthersModal";
import TransactionSucceededModal from "./Modals/TransactionSucceededModal";
import TransactionFailedModal from "./Modals/TransactionFailedModal";
import detectEthereumProvider from "@metamask/detect-provider";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalAccount: this.personalAccount,
            personalAccountTokensBalance: 0,
            personalAccountEthersBalance: 0,
            loading: false,
            tokensAmount: '',
            isAmountEmpty: true,
            tokenPriceFromBlockChainInEther: 0,
            tokenPriceFromBlockChainInWei: 0,
            tokensToBePurchasedPriceInWei: 0,
            tokensToBePurchasedPriceInEther: 0,
            purchaseConfirmationModalShow: false,
            NotEnoughEthersModalShow: false,
            transactionSucceededModalShow: false,
            transactionFailedModalShow: false,
            transactionFailedStatus: ''
        };
    }

    componentDidMount() {
        this.loadBlockChainData().then((tokenPrice) => {
            this.setState({tokenPriceFromBlockChainInEther: this.web3.utils.fromWei(`${tokenPrice}`, 'ether')});
            this.setState({tokenPriceFromBlockChainInWei: tokenPrice});
            this.setState({personalAccount: this.personalAccount});
            this.setState({personalAccountBalance: this.tokensBalance});
            this.setState({personalAccountEthersBalance: this.ethersBalance});
        })
    }


    async loadBlockChainData() {
        const provider = await detectEthereumProvider();
        if (provider) {
            this.web3 = new Web3(provider);
            this.accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        } else {
            alert('Please install MetaMask!');
        }
        this.personalAccount = this.accounts[0];
        this.gran = this.web3.utils.toBN(10 ** 18);
        this.erc777AT = new this.web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        this.staicSale = new this.web3.eth.Contract(STATICSALE_API, STATICSALE_ADDRESS);
        this.tokensBalance = await this.erc777AT.methods.balanceOf('0x006510FA9a9b5b0566209347200d3300081342f3').call();
        this.weiBalance = await this.web3.eth.getBalance(this.personalAccount);
        this.ethersBalance = this.web3.utils.fromWei(this.weiBalance, 'ether');
        return await this.staicSale.methods.getPricePerToken(ERC777AT_ADDRESS, '0x006510FA9a9b5b0566209347200d3300081342f3').call();

    }

    handleAmountChange(event) {

        let input = parseInt(event.target.value);
        if (isNaN(input)) {
            this.setState({isAmountEmpty: true});
            this.setState({tokensAmount: ''});
        } else {
            input = input >= 0 ? input : 1;
            this.setState({isAmountEmpty: false});
            this.setState({tokensAmount: input});
        }
    }

    handleBuy(event) {
        event.preventDefault();
        this.setState({tokensToBePurchasedPriceInWei: this.state.tokensAmount * this.state.tokenPriceFromBlockChainInWei});
        this.tokensToBePurchasedPriceInWei = this.state.tokensAmount * this.state.tokenPriceFromBlockChainInWei;
        this.setState({tokensToBePurchasedPriceInEther: this.web3.utils.fromWei(`${this.state.tokensAmount * this.state.tokenPriceFromBlockChainInWei}`, 'ether')});
        this.setState({purchaseConfirmationModalShow: true});
        this.setState({tokensAmount: ''});
        this.setState({isAmountEmpty: true});


    }


    async afterTransactionSucceeded() {
        this.setState({loading: false});
        let balance = await this.erc777AT.methods.balanceOf(this.personalAccount).call();
        balance = this.web3.utils.toBN(balance);
        balance = balance.div(this.gran).toNumber();
        this.setState({personalAccountTokensBalance: balance});
        this.setState({transactionSucceededModalShow: true});

    }

    async handlePurchase(event) {
        console.log(this.state.tokensToBePurchasedPriceInEther);
        console.log(this.state.tokensToBePurchasedPriceInWei);
        this.setState({purchaseConfirmationModalShow: false});
        if (this.state.tokensToBePurchasedPriceInEther > this.state.personalAccountEthersBalance) {
            this.setState({NotEnoughEthersModalShow: true});
        } else {
            this.setState({loading: true});
            const priceInWei = this.state.tokensToBePurchasedPriceInWei;
            this.staicSale.methods.send(ERC777AT_ADDRESS, '0x006510FA9a9b5b0566209347200d3300081342f3').send({
                from: this.state.personalAccount,
                value: priceInWei
            }).then(receipt => {
                this.setState({loading: false});
                this.afterTransactionSucceeded();
            }).catch(error => {
                if (error.code === 4001) {
                    this.setState({loading: false});
                    this.setState({transactionFailedStatus: 'rejected from the user'});
                    this.setState({transactionFailedModalShow: true});
                }

            })

        }


    }

    render() {
        return (
            (!this.state.loading) ?
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap shadow p-2">
                        <a className="navbar-brand col-sm-3 col-md-2 mr-0"
                           href="https://github.com/Asem-Abdelhady/ERC777-AirDrop" target="_blank">ERC777AT |
                            Static-Sale
                            ERC777AT tokens</a>
                        <span className="d-flex text-white">{this.state.personalAccount}</span>
                    </nav>

                    <div>
                        <main style={{margin: "auto", marginTop: "120px", width: "500px"}}>
                            <AmountToBuyText tokenPrice={this.state.tokenPriceFromBlockChainInEther}/>
                            <BuyATForm onSubmit={(event) => this.handleBuy(event)}
                                       onChange={event => this.handleAmountChange(event)}
                                       input={this.state.tokensAmount}
                                       isEmpty={this.state.isAmountEmpty}/>
                        </main>
                    </div>
                    <TokensPurchaseConfirmationModal
                        show={this.state.purchaseConfirmationModalShow}
                        onHide={() => this.setState({purchaseConfirmationModalShow: false})}
                        buyTokens={(event) => this.handlePurchase(event)}
                        tokensNumber={this.state.tokensAmount}
                        tokensPrice={this.state.tokensToBePurchasedPriceInEther}/>
                    <NotEnoughEthersModal show={this.state.NotEnoughEthersModalShow}
                                          onHide={() => this.setState({NotEnoughEthersModalShow: false})}/>
                    <TransactionFailedModal show={this.state.transactionFailedModalShow}
                                            onHide={() => this.setState({transactionFailedModalShow: false})}
                                            transactionFailedStatus={this.state.transactionFailedStatus}/>
                    <TransactionSucceededModal show={this.state.transactionSucceededModalShow}
                                               onHide={() => this.setState({transactionSucceededModalShow: false})}
                                               balance={this.state.personalAccountTokensBalance}/>
                </div> :
                <Loading/>
        );
    }
}

export default App;
