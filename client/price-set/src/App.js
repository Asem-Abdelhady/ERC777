import './App.css';
import {Component} from "react";
import TokenHolderHeadline from "./TokenHolderHeadline";
import SetPriceForm from "./SetPriceForm";
import {ERC777AT_ABI, ERC777AT_ADDRESS, STATICSALE_ADDRESS, STATICSALE_API} from "./config";
import Web3 from "web3";
import Loading from "./Loading";
import PriceSetConfirmationModal from "./Modals/PriceSetConfirmationModal";
import TransactionFailedModal from "./Modals/TransactionFailedModal";
import TransactionSucceededModal from "./Modals/TransactionSucceededModal";
import SameTokenPriceModal from "./Modals/SameTokenPriceModal";
import NoATModal from "./Modals/NoATModal";
import detectEthereumProvider from "@metamask/detect-provider";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalAccount: this.personalAccount,
            personalAccountTokensBalance: 0,
            personalAccountEthersBalance: 0,
            tokenPriceFromBlockChain: 0,
            priceSetConfirmationModalShow: false,
            transactionSucceededModalShow: false,
            transactionFailedModalShow: false,
            sameTokenPriceModalShow: false,
            noATModalShow: false,
            transactionFailedStatus: '',
            tokenNewPriceInput: '',
            isPriceEmpty: true,
            loading: false
        }
    }

    componentDidMount() {
        this.loadBlockChainData().then((tokenPrice) => {
            this.setState({tokenPriceFromBlockChain: tokenPrice});
            this.setState({personalAccount: this.personalAccount});
            this.setState({personalAccountTokensBalance: this.tokensBalance});
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
        this.erc777AT = new this.web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        this.staicSale = new this.web3.eth.Contract(STATICSALE_API, STATICSALE_ADDRESS);
        this.tokensBalance = await this.erc777AT.methods.balanceOf(this.personalAccount).call();
        this.weiBalance = await this.web3.eth.getBalance(this.personalAccount);
        this.ethersBalance = this.web3.utils.fromWei(this.weiBalance, 'ether');
        return await this.staicSale.methods.getPricePerToken(ERC777AT_ADDRESS, this.personalAccount).call();

    }

    handleSet(event) {
        event.preventDefault();
        this.setState({isPriceEmpty: true});
        if (this.state.personalAccountTokensBalance.toString() === '0') {
            this.setState({noATModalShow: true});
        } else {
            if (this.state.tokenNewPriceInput === this.state.tokenPriceFromBlockChain) {
                this.setState({sameTokenPriceModalShow: true});
            } else {
                this.setState({priceSetConfirmationModalShow: true});
            }
        }
    }

    handlePriceChange(event) {
        let input = event.target.value;
        if (input === '') this.setState({isPriceEmpty: true});
        else this.setState({isPriceEmpty: false});
        this.setState({tokenNewPriceInput: input});
    }

    async handleSetPrice(event) {
        this.setState({priceSetConfirmationModalShow: false});
        this.setState({loading: true});
        let tokenPrice = this.state.tokenNewPriceInput;
        this.setState({tokenNewPriceInput: ''});
        this.staicSale.methods.setPricePerToken(ERC777AT_ADDRESS, tokenPrice).send({from: this.state.personalAccount})
            .then(receipt => {
                this.setState({transactionSucceededModalShow: true});

            }).catch(error => {
            if (error.code === 4001) {
                this.setState({transactionFailedStatus: 'rejected from the user'});
                this.setState({transactionFailedModalShow: true});
            }
        });
        this.setState({loading: false});

    }

    render() {
        return (
            (!this.state.loading) ?
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap shadow p-2">
                        <a className="navbar-brand col-sm-3 col-md-2 mr-0"
                           href="https://github.com/Asem-Abdelhady/ERC777-AirDrop" target="_blank">ERC777AT |
                            Price-Set
                            ERC777AT tokens</a>
                        <span className="d-flex text-white">{this.state.personalAccount}</span>
                    </nav>
                    <div>
                        <main style={{margin: "auto", marginTop: "120px", width: "500px"}}>
                            <TokenHolderHeadline/>

                            <SetPriceForm onSubmit={(event) => this.handleSet(event)}
                                          onChange={(event) => this.handlePriceChange(event)}
                                          isEmpty={this.state.isPriceEmpty}
                                          input={this.state.tokenNewPriceInput}/>
                        </main>
                    </div>

                    <PriceSetConfirmationModal show={this.state.priceSetConfirmationModalShow}
                                               onHide={() => this.setState({priceSetConfirmationModalShow: false})}
                                               currentPrice={this.state.tokenPriceFromBlockChain}
                                               newPrice={this.state.tokenNewPriceInput}
                                               setPrice={event => this.handleSetPrice(event)}/>

                    <TransactionFailedModal show={this.state.transactionFailedModalShow}
                                            onHide={() => this.setState({transactionFailedModalShow: false})}
                                            transactionFailedStatus={this.state.transactionFailedStatus}/>
                    <TransactionSucceededModal show={this.state.transactionSucceededModalShow}
                                               onHide={() => this.setState({transactionSucceededModalShow: false})}
                                               newPrice={this.state.tokenNewPriceInput}/>
                    <SameTokenPriceModal show={this.state.sameTokenPriceModalShow}
                                         onHide={() => this.setState({sameTokenPriceModalShow: false})}/>
                    <NoATModal show={this.state.noATModalShow}
                               onHide={() => this.setState({noATModalShow: false})}/>
                </div> :
                <Loading/>

        );
    }
}

export default App;
