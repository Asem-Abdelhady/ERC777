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
            tokenPriceFromBlockChain: 0,
            tokensToBePurchasedPrice: 0,
            purchaseConfirmationModalShow: false,
            NotEnoughEthersModalShow: false,
            transactionSucceededModalShow: false,
            transactionFailedModalShow: false,
            transactionFailedStatus: ''
        };
    }

    componentDidMount() {
        this.web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        this.loadBlockChainData().then((tokenPrice) => {
            this.setState({tokenPriceFromBlockChain: tokenPrice});
            this.setState({personalAccount: this.personalAccount});
            this.setState({personalAccountBalance: this.tokensBalance});
            this.setState({personalAccountEthersBalance: this.ethersBalance});
        })
    }


    async loadBlockChainData() {
        this.accounts = await this.web3.eth.getAccounts();
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
        let input = event.target.value;
        if (input === '') this.setState({isAmountEmpty: true})
        else this.setState({isAmountEmpty: false});
        this.setState({tokensAmount: event.target.value});
    }

    handleBuy(event) {
        event.preventDefault();
        const tokensPrice = this.state.tokensAmount * this.state.tokenPriceFromBlockChain;
        this.setState({tokensToBePurchasedPrice: tokensPrice});
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
        this.setState({purchaseConfirmationModalShow: false});
        if (this.state.tokensToBePurchasedPrice > this.state.personalAccountEthersBalance) {
            this.setState({NotEnoughEthersModalShow: true});
        } else {
            this.setState({loading: true});
            const priceFromUser = this.web3.utils.toBN(this.state.tokensToBePurchasedPrice);
            const priceInEther = this.gran.mul(priceFromUser);
            this.staicSale.methods.send(ERC777AT_ADDRESS, '0x0e3d412f9C6E9aA361C9615dAdEfbBD2C27eBa5f').send({
                from: this.state.personalAccount,
                value: priceInEther
            }).then(receipt => {
                this.afterTransactionSucceeded();

            }).catch(error => {
                if (error.code === 4001) {
                    this.setState({transactionFailedStatus: 'rejected from the user'});
                    this.setState({transactionFailedModalShow: true});
                }

            })

        }

        this.setState({loading: false});

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
                            <AmountToBuyText tokenPrice={this.state.tokenPriceFromBlockChain}/>
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
                        tokensPrice={this.state.tokensToBePurchasedPrice}/>
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
