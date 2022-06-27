import './App.css';
import {Component} from "react";
import TokenHolderHeadline from "./TokenHolderHeadline";
import SetPriceForm from "./SetPriceForm";
import {ERC777AT_ABI, ERC777AT_ADDRESS, STATICSALE_ADDRESS, STATICSALE_API} from "./config";
import Web3 from "web3";
import Loading from "./Loading";
import PriceSetConfirmationModal from "./Modals/PriceSetConfirmationModal";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalAccount: this.personalAccount,
            personalAccountTokensBalance: 0,
            personalAccountEthersBalance: 0,
            tokenPriceFromBlockChain: 0,
            priceSetConfirmationModalShow: false,
            tokenNewPriceInput: '',
            isPriceEmpty: true,
            loading: false
        }
    }

    componentDidMount() {
        this.web3 = new Web3(Web3.givenProvider || "http://localhost:3001");
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
        this.erc777AT = new this.web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        this.staicSale = new this.web3.eth.Contract(STATICSALE_API, STATICSALE_ADDRESS);
        this.tokensBalance = await this.erc777AT.methods.balanceOf(this.personalAccount).call();
        this.weiBalance = await this.web3.eth.getBalance(this.personalAccount);
        this.ethersBalance = this.web3.utils.fromWei(this.weiBalance, 'ether');
        return await this.staicSale.methods.getPricePerToken(ERC777AT_ADDRESS, this.personalAccount).call();

    }

    handleSet(event){
        event.preventDefault();
        this.setState({isPriceEmpty:true});
        this.setState({priceSetConfirmationModalShow: true});
    }

    handlePriceChange(event) {
        let input = event.target.value;
        if (input === '') this.setState({isPriceEmpty: true});
        else this.setState({isPriceEmpty: false});
        this.setState({tokenNewPriceInput: input});
    }

    async handleSetPrice(event) {
        console.log("Setting price");
        this.setState({loading: true});
        const tokenPrice = this.state.tokenPriceFromHolderInput;
        this.staicSale.methods.setPricePerToken(ERC777AT_ADDRESS, tokenPrice).send({from: this.state.personalAccount})
            .then(receipt => {
                console.log("Set correctly!!");
            }).catch(error => {
            console.log("failed to set!");
        })
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
                                          onChange={event => this.handlePriceChange(event)}
                                          isEmpty={this.state.isPriceEmpty}
                                          input={this.state.tokenNewPriceInput}/>
                        </main>
                    </div>

                    <PriceSetConfirmationModal show={this.state.priceSetConfirmationModalShow}
                                               onHide={() => this.setState({priceSetConfirmationModalShow: false})}
                                               currentPrice={this.state.tokenPriceFromBlockChain}
                                               newPrice={this.state.tokenNewPriceInput}
                                               setPrice={this.handleSetPrice()}/>
                </div> :
                <Loading/>

        );
    }
}

export default App;
