// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
	const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
	const pixelPlazaNft = await NFTMarket.deploy();
	await pixelPlazaNft.deployed();
	console.log("NFTMarket deployed to:", pixelPlazaNft.address);

	const NFT = await hre.ethers.getContractFactory("NFT");
	const minter= await NFT.deploy(pixelPlazaNft.address);
	await minter.deployed();
	console.log("NFT deployed to:", minter.address);

	// todo - remove self-modifying code
	fs.writeFileSync('./nft.config.js', `
	export const nftmarketaddress = "${pixelPlazaNft.address}"
	export const nftaddress = "${minter.address}"
	`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
