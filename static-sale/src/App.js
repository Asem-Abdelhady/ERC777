import './App.css';
import React, {Component} from "react";
import Web3 from "web3";
import Loading from "./Loading";
import BuyATForm from "./BuyATForm";
import AmountToBuyText from "./AmountToBuyText";
import {ERC777AT_ABI, ERC777AT_ADDRESS, STATICSALE_ADDRESS, STATICSALE_API} from "./config";
import SetPriceForm from "./SetPriceForm";
import TokensPurchaseConfirmationModal from "./Modals/TokensPurchaseConfirmationModal";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalAccount: this.personalAccount,
            personalAccountBalance: this.balance,
            loading: false,
            tokensAmount: 0,
            tokenPriceFromBlockChain: 0,
            tokensToBePurchasedPrice: 0,
            purchaseConfirmationModalShow: false,
        };
    }

    componentDidMount() {
        this.web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        this.loadBlockChainData().then((tokenPrice) => {
            this.setState({tokenPriceFromBlockChain: tokenPrice});
            this.setState({personalAccount: this.personalAccount});
            this.setState({personalAccountBalance: this.balance});
        })
    }


    async loadBlockChainData() {
        this.accounts = await this.web3.eth.getAccounts();
        this.personalAccount = this.accounts[0];
        this.gran = this.web3.utils.toBN(10 ** 18);
        this.erc777AT = new this.web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        this.staicSale = new this.web3.eth.Contract(STATICSALE_API, STATICSALE_ADDRESS);
        this.balance = await this.erc777AT.methods.balanceOf('0x0e3d412f9C6E9aA361C9615dAdEfbBD2C27eBa5f').call();
        return await this.staicSale.methods.getPricePerToken(ERC777AT_ADDRESS, this.personalAccount).call();

    }

    handleAmountChange(event) {
        this.setState({tokensAmount: event.target.value});
    }

    handleBuy(event) {
        event.preventDefault();
        const tokensPrice = this.state.tokensAmount * this.state.tokenPriceFromBlockChain;
        this.setState({tokensToBePurchasedPrice: tokensPrice});
        this.setState({purchaseConfirmationModalShow: true});
    }

    handlePriceChange(event) {
        this.setState({tokenPriceFromHolderInput: event.target.value});

    }

    async handlePriceSet(event) {
        event.preventDefault();
        console.log("Seeting price");
        this.setState({loading: true});
        this.staicSale.methods.setPricePerToken(ERC777AT_ADDRESS, this.state.tokenPriceFromHolderInput).send({from: this.accounts[0]})
            .then(receipt => {
                console.log("Set correctly!!");
            }).catch(error => {
            console.log("failed to set!");
        })
        this.setState({loading: false});
    }

    async handlePurchase(event) {
        this.setState({purchaseConfirmationModalShow: false});
        this.setState({loading: true});
        this.staicSale.methods.send(ERC777AT_ADDRESS,'0x0e3d412f9C6E9aA361C9615dAdEfbBD2C27eBa5f').send({from:this.state.personalAccount, value:this.state.tokensToBePurchasedPrice}
        );

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
                                       onChange={event => this.handleAmountChange(event)}/>
                            <SetPriceForm onSubmit={(event) => this.handlePriceSet(event)}
                                          onChange={event => this.handlePriceChange(event)}/>
                        </main>
                    </div>
                    <TokensPurchaseConfirmationModal
                        show={this.state.purchaseConfirmationModalShow}
                        onHide={() => this.setState({purchaseConfirmationModalShow: false})}
                        buyTokens={(event) => this.handlePurchase(event)}
                        tokensNumber={this.state.tokensAmount}
                        tokensPrice={this.state.tokensToBePurchasedPrice}/>
                </div> :
                <Loading/>
        );
    }
}

export default App;
