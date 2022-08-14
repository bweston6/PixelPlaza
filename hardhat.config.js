require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");

// todo - change me to the final business account and read from env var
const ACCOUNT_PK = "dbee0892ed2bd982f27b53aac17defcd3c35664fd8b80d7605cd02c95a09894d"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	networks: {
		hardhat: {
			chainId: 1337,
		},
		mumbai: {
			url: "https://rpc-mumbai.matic.today",
			accounts: [ACCOUNT_PK],
		},
		mainnet: {
			url: "https://polygon-rpc.com",
			accounts: [ACCOUNT_PK],
		},
	},
  solidity: "0.8.9",
};
