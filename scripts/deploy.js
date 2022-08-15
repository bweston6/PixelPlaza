// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
	const PixelPlaza_NFT = await hre.ethers.getContractFactory("PixelPlaza_NFT");
	const pixelPlazaNft = await PixelPlaza_NFT.deploy();
	await pixelPlazaNft.deployed();
	console.log("PixelPlaza_NFT deployed to:", pixelPlazaNft.address);

	const Minter = await hre.ethers.getContractFactory("Minter");
	const minter= await Minter.deploy(pixelPlazaNft.address);
	await minter.deployed();
	console.log("Minter deployed to:", minter.address);

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
