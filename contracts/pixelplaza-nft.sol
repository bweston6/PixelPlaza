// SPDX-License-Identifier: MIT
// todo - types are not congruent, mixing of uint and uint256
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // prevents re-entrancy attacks

contract NFTMarket is ReentrancyGuard {
	using Counters for Counters.Counter;
	Counters.Counter private _itemIds; // total number of items ever created
	Counters.Counter private _itemsSold; // total number of items sold


	/* Owner */

	address payable owner; // owner of the smart contract

	constructor(){
		owner = payable(msg.sender);
	}


	/* Listing Price */

	uint256 listingPrice; // people have to pay to buy their NFT on this marketplace

	/// @notice get the listingprice
	function getListingPrice() public view returns (uint256){
		return listingPrice;
	}

	/// @notice set the listingprice
	function setListingPrice(uint _price) public returns(uint) {
		if(msg.sender == address(this) ){
			listingPrice = _price;
		}
		return listingPrice;
	}


	/* MarketItem */

	struct MarketItem {
		uint itemId;
		address nftContract;
		uint256 tokenId;
		address payable seller; // person selling the nft
		address payable owner; // owner of the nft
		uint256 price;
		bool sold;
	}

	// access the MarketItem via itemId
	mapping(uint256 => MarketItem) private idMarketItem;

	// log message (when Item is sold)
	event MarketItemCreated (
		uint indexed itemId,
		address indexed nftContract,
		uint256 indexed tokenId,
		address  seller,
		address  owner,
		uint256 price,
		bool sold
	);

	/// @notice function to create market item
	function createMarketItem(
		address nftContract,
		uint256 tokenId,
		uint256 price
	) public payable nonReentrant {
		require(price > 0, "Price must be above zero");
		require(msg.value == listingPrice, "Price must be equal to listing price"); // todo - commented out?

		_itemIds.increment(); // add 1 to the total number of items ever created
		uint256 itemId = _itemIds.current();

		idMarketItem[itemId] = MarketItem(
			itemId,
			nftContract,
			tokenId,
			payable(msg.sender), // address of the seller putting the nft up for sale
			payable(address(0)), // no owner yet (set owner to empty address), todo - implication for ToS
			price,
			false
		);

		// transfer ownership of the nft to the contract itself
		IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId); // todo - contract owns the item until  it is sold, not the seller

		// log this transaction
		emit MarketItemCreated(
			itemId,
			nftContract,
			tokenId,
			msg.sender,
			address(0),
			price,
			false
		);
	}

	/// @notice function to create a sale
	function createMarketSale(
		address nftContract,
		uint256 itemId
	) public payable nonReentrant {
		uint price = idMarketItem[itemId].price;
		uint tokenId = idMarketItem[itemId].tokenId;
		uint listingNumerator = 25; // todo - explain through this, to ensure pricing and commission is correct
		uint listingDenominator = 1000;
		setListingPrice(idMarketItem[itemId].price * listingNumerator / listingDenominator);
		require(msg.value == price, "Please submit the asking price in order to complete purchase");

		// pay the seller the amount
		idMarketItem[itemId].seller.transfer(msg.value - listingPrice);
		// transfer ownership of the nft from the contract itself to the buyer
		IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
		idMarketItem[itemId].owner = payable(msg.sender); // mark buyer as new owner
		idMarketItem[itemId].sold = true; // mark that it has been sold
		_itemsSold.increment(); // increment the total number of Items sold by 1
		payable(owner).transfer(listingPrice); // pay owner of contract the listing price
	}


	/* Query Functions */

	/// @notice total number of items unsold on our platform
	function fetchMarketItems() public view returns (MarketItem[] memory){
		uint itemCount = _itemIds.current(); // total number of items ever created
		uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
		uint currentIndex = 0;

		MarketItem[] memory items =  new MarketItem[](unsoldItemCount);

		// loop through all items ever created
		for(uint i = 0; i < itemCount; i++){
			// iterate through unsold items via address of 0
			if(idMarketItem[i + 1].owner == address(0)){
				uint currentId = idMarketItem[i + 1].itemId;
				MarketItem storage currentItem = idMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items; // return array of all unsold items
	}

	/// @notice fetch list of NFTS owned/bought by this user
	function fetchMyNFTs() public view returns (MarketItem[] memory){
		uint totalItemCount = _itemIds.current();
		uint itemCount = 0;
		uint currentIndex = 0;

		// count the items owned by this user as there are no linked lists
		for(uint i = 0; i < totalItemCount; i++){
			if(idMarketItem[i + 1].owner == msg.sender){
				itemCount += 1;
			}
		}

		MarketItem[] memory items = new MarketItem[](itemCount);
		for(uint i = 0; i < totalItemCount; i++){
			if(idMarketItem[i + 1].owner == msg.sender){
				uint currentId = idMarketItem[i + 1].itemId;
				MarketItem storage currentItem = idMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	/// @notice fetch list of NFTS owned/bought by this user
	function fetchItemsCreated() public view returns (MarketItem[] memory){
		uint totalItemCount = _itemIds.current();
		uint itemCount = 0;
		uint currentIndex = 0;

		// count the items that this user has bought/is the owner
		for(uint i = 0; i < totalItemCount; i++){
			if(idMarketItem[i + 1].seller == msg.sender){
				itemCount += 1; // total length
			}
		}

		MarketItem[] memory items = new MarketItem[](itemCount);
		for(uint i = 0; i < totalItemCount; i++){
			if(idMarketItem[i+1].seller == msg.sender){
				uint currentId = idMarketItem[i + 1].itemId;
				MarketItem storage currentItem = idMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}
}
