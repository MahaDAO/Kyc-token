require('dotenv').config();
require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require("@truffle/hdwallet-provider");

console.log(process.env.METAMASK_WALLET_SECRET);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          process.env.METAMASK_WALLET_SECRET,
          'https://rinkeby.infura.io/v3/e95c6744ded94bbe81e881b8ca002ce7'
        )
      },
      networkCheckTimeout: 100000,
      network_id: 4,
      skipDryRun: true
    },
    matic_testnet: {
      url: "https://matic-mumbai.chainstacklabs.com",
      provider: function() {
        return new HDWalletProvider(process.env.METAMASK_WALLET_SECRET, "https://matic-mumbai.chainstacklabs.com");
      },
      networkCheckTimeout: 100000,
      network_id: 80001,
      skipDryRun: true
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      provider: function() {
        return new HDWalletProvider(process.env.METAMASK_WALLET_SECRET, "https://data-seed-prebsc-1-s1.binance.org:8545/");
      },
      network_id: 97
    },
    scallop_testnet: {
      url: "http://scallop.rpc.devicoin.org/",
      provider: function() {
        return new HDWalletProvider(process.env.SUPER_ACCOUNT, "http://scallop.rpc.devicoin.org/");
      },
      network_id: 9001
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './server/abis/',
  compilers: {
    solc: {
      version: '0.8.0+commit.c7dfd78e',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    polygonscan: process.env.POLYGONSCAN_API_KEY,
    bscscan: process.env.BSCSCAN_API_KEY
  }
}