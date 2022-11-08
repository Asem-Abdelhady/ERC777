const HDWalletProvider = require("@truffle/hdwallet-provider");

require("dotenv").config();
module.exports = {
  networks: {
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNENOMIC,
          "wss://rinkeby.infura.io/ws/v3/" + process.env.INFURA_API_KEY
        ),
      network_id: 4,
      networkCheckTimeout: 1000000,
    },

    goerli: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MNENOMIC,
          },
          providerOrUrl:
            "https://goerli.infura.io/v3/" + process.env.GORLI_RPC_URL,
          numberOfAddresses: 1,
          shareNonce: true,
        }),
      network_id: "5",
    },
  },

  compilers: {
    solc: {
      version: "0.8.13", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersio
      //  evmVersion: "byzantium"
      // }
    },
  },
};

//
// module.exports = {
//     networks: {
//         development: {
//             host: "127.0.0.1",
//             port: 7545,
//             network_id: "*" // Match any network id
//         }
//     },
//     compilers: {
//         solc: {
//             version: "0.8.13"      // Fetch exact version from solc-bin (default: truffle's version)
//             // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
//             // settings: {          // See the solidity docs for advice about optimization and evmVersio
//             //  evmVersion: "byzantium"
//             // }
//         }
//     }
// }
