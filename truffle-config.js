const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();
module.exports = {
    networks: {
        rinkeby: {
            provider: () => new HDWalletProvider(process.env.MNENOMIC, "wss://rinkeby.infura.io/ws/v3/" + process.env.INFURA_API_KEY),
            network_id: 4,
            networkCheckTimeout: 1000000
        }
    },

    compilers: {
        solc: {
            version: "0.8.13"      // Fetch exact version from solc-bin (default: truffle's version)
            // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            // settings: {          // See the solidity docs for advice about optimization and evmVersio
            //  evmVersion: "byzantium"
            // }
        }
    }
};
