const HDWalletProvider = require("truffle-hdwallet-provider");

const MNEMONIC = "spirit supply whale amount human item harsh scare congress discover talent hamster";
const API_KEY = "05de84e4fcf340b4b7be112aaab40508";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*",
        gas: 999999999
    },
    rinkeby: {
        provider: function() {
            return new HDWalletProvider(MNEMONIC, 'https://rinkeby.infura.io/v3/' + API_KEY)
        },
        network_id: 4
    }
  },
  compilers: {
    solc: {
      version: "^0.5.0", // A version or constraint - Ex. "^0.5.0"
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000   // Optimize for how many times you intend to run the code
        }
      }
    }
  }
};