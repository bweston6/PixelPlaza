import Web3Modal from "web3modal";
import axios from "axios";
import {ethers} from "ethers";
import {useEffect, useState} from "react";

import {nftaddress, nftmarketaddress} from "../../nft.config";


// import contract representations
import Minter from "../../artifacts/contracts/PixelPlazaNftMinter.sol/NFT.json";
import PixelPlaza_NFT from "../../artifacts/contracts/PixelPlazaMarketPlace.sol/NFTMarket.json";


function Nfts() {
	// define state
	const [nfts, setNfts] = useState([]);
	const [loadingState, setLoadingState] = useState("not-loaded");

	useEffect(() => {
		loadNFTs();
	}, []);

	async function loadNFTs() {
		const provider = new ethers.providers.JsonRpcProvider();
		const tokenContract = new ethers.Contract(nftaddress, Minter.abi, provider);
		const marketContract = new ethers.Contract(nftmarketaddress, PixelPlaza_NFT.abi, provider);

		// get unsold market items
		const data = await marketContract.fetchMarketItems();

		// create array of items
		const items = await Promise.all(data.map(async i => {
			let price = ethers.utils.formatUnits(i.price.toString(), "ether")
			let item = {
				price,
				tokenId: i.tokenId.toNumber(),
				seller: i.seller,
				owner: i.owner,
				image: i.tokenUri,
				name: i.name,
				description: i.description,
			}
			return item;
		}));
		setNfts(items);
		setLoadingState("loaded");
	}

	async function buyNft(nft) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);

		const signer = provider.getSigner();
		const contract = new ethers.Contract(nftmarketaddress, Minter.abi, signer);

		const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

		// create the sale
		const transaction = await contract.createMarketSale(
			nftaddress,
			nft.tokenId,
			{value: price}
		);

		// reload the page without the sold NFT
		await transaction.wait();
		loadNFTs();
	}

	// if marketplace is empty
	if (loadingState === "loaded" && !nfts.length) {
		return (
			<p>
				No NFTs for sale, get making!
			</p>
		);
	}

	return (
		nfts.map((nft, i) => (
			<div className="card">
				<img loading="lazy" alt={nft.title} src={nft.image}/>
				<div className="details">
					<img loading="lazy" alt={nft.seller} src="http://picsum.photos/50/50"/>
					<div>
						<b>{nft.name}</b> by <b>{nft.seller}</b>
					</div>
				</div>
			</div>
		))
	)
}

export default Nfts
