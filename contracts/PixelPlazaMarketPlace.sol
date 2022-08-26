// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;
//pragma solidity >=0.4.0 <0.7.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

//Reentrancy guard is here for security
contract NFTMarket is
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable,
    IERC721ReceiverUpgradeable
{
    using AddressUpgradeable for address payable;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using SafeMathUpgradeable for uint256;
    CountersUpgradeable.Counter private _itemIds; //incrementable counters for the ID's and the sold items
    CountersUpgradeable.Counter private _itemsSold;

    uint256 mintingRoyalty;
    //Setting up royalty and market fee
    function initialize() public initializer {
        OwnableUpgradeable.__Ownable_init();
        mintingRoyalty = 1.0 ether; //MATIC, not ether
    }

    struct MarketItem {
        string title;
        string description;
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        uint256 royalty;
        address payable seller; //Seller of NFT
        address payable owner; //New owner after transfer, buyer
        address payable creator; //Original creator of the NFT
        uint256 price;
        bool sold;
        string tokenUri;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    //The following events are to be emitted.

    // Assume tokenUri doesn't change, so don't add to other events
    event MarketItemCreated(
        string title,
        string description,
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 royalty,
        address seller,
        address owner,
        address creator,
        uint256 price,
        bool sold,
        string tokenUri
    );

    event MarketItemListed(
        string title,
        string description,
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 royalty,
        address seller,
        address owner,
        address creator,
        uint256 price,
        bool sold
    );

    event MarketItemPriceChanged(
        string title,
        string description,
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 royalty,
        address seller,
        address owner,
        address creator,
        uint256 price,
        bool sold
    );

    // Include marketAddress so we can display it when displaying these events
    // (marketAddress = from, owner = to)
    //
    // Seller here is the person who listed, not the address of the market
    struct MarketItemSold{
        string title;
        string description;
        uint256 itemId;
        address  nftContract;
        uint256 tokenId;
        uint256 royalty;
        address  seller;
        address owner;
        address creator;
        uint256 price;
        bool sold;
        address marketAddress;
    }
    
    mapping(uint256 => MarketItemSold) private idToMarketItemSold;
    /**
     * Returns the listing price of the contract
     */
    function getmintingRoyalty() public view returns (uint256) {
        return mintingRoyalty;
    }

    function setmintingRoyalty(uint256 price) public onlyOwner {
        mintingRoyalty = price;
    }

    ///
    /// LISTING + BUYING/SELLING
    ///

    /**
     * Places an item for sale on the marketplace
     * First time NFT is listed uses this function
     */
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 royalty,
        string memory title,
        string  memory description
    ) public payable nonReentrant {
        require(price >= 1, "Price must be at least 1 MATIC");
        require(msg.value == mintingRoyalty,"Price must be equal to listing price"); //User sending in the transaction must also send in some payment for our royalty. (msg.value)
        require(royalty <= 10, "Royalty fees are at most 10%");
        uint256 itemId = _itemIds.current();
        string memory tokenUri = ERC721URIStorage(nftContract).tokenURI(tokenId);
        idToMarketItem[itemId] = MarketItem(
            title,
            description,
            itemId,
            nftContract,
            tokenId,
            royalty,
            // Seller
            payable(msg.sender),
            // Owner
            payable(address(this)),
            // Creator
            payable(msg.sender),
            price,
            false,
            tokenUri // must have a token URI here
        );

        
        
        //Creating market item, sending the nft contract from Seller (msg.sender), to the market (addres(this)).
        IERC721(nftContract).safeTransferFrom(msg.sender,address(this),tokenId);

        //Send us the minting royalty.
        payable(owner()).sendValue(mintingRoyalty);

        emit MarketItemCreated(
            title,
            description,
            itemId,
            nftContract,
            tokenId,
            royalty,
            // Seller
            msg.sender,
            // Owner, which happens to be us at the moment.
            address(this),
            // Creator, which is same as seller, for a first time listing.
            msg.sender,
            price,
            false,
            tokenUri
        );
    }
    /**
     * Creates the sale of a marketplace item
     * Transfers ownership of the item, as well as funds between parties
     */
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        //address ourContract = nftContract;
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        uint256 royalty = idToMarketItem[itemId].royalty;
        string memory title = idToMarketItem[itemId].title;
        string memory description = idToMarketItem[itemId].description;
        address currentOwner =  idToMarketItem[itemId].owner;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        // Market cut is 2.5% of the sale
        uint256 marketCut = (msg.value).div(100).mul(25).div(10);
        uint256 sellerCut = msg.value.sub(marketCut);
        uint256 creatorCut = 0;
        //On the first sale, the creator does not get any royalties.
        if (idToMarketItem[itemId].creator != idToMarketItem[itemId].seller) {
            // If it is a consecutive sale (creator isn't the seller), creator gets their specified royalty
            creatorCut = (msg.value).div(100).mul(royalty);
            //sellerCut is now less if this is the case.
            sellerCut = sellerCut.sub(creatorCut);
            idToMarketItem[itemId].creator.sendValue(creatorCut);
        }
        //old sellers address recorded so we can keep track of it. Sellercut is sent.
        address oldSeller = idToMarketItem[itemId].seller;
        idToMarketItem[itemId].seller.sendValue(sellerCut);

        //contract is transferred from us (currently holding the listing) to the 
        IERC721(nftContract).safeTransferFrom(address(this),msg.sender,tokenId);
        // This is where it does get slightly confusing.
        // The owner is NOT us in this case, we are setting the owner of the itemId to the new owner of the NFT, remember this.
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].seller = payable(address(0));
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();

        // Transfer money from this contract to the contract's owner!
        payable(owner()).sendValue(getBalance()); //Transfering leftover money to us, the owner of the contract.

        idToMarketItemSold[itemId] = MarketItemSold(
            title,
            description,
            itemId,
            nftContract,
            tokenId,
            royalty,
            // Old seller is recorded
            idToMarketItem[itemId].seller,
            // This is where it does get slightly confusing, again.
            // Instead of being us as the owner, as it would be on a first time listing, the owner is now the new owner of the NFT, and will remain that way
            // Until they decide to relist the item on our site.
            idToMarketItem[itemId].owner,
            // Creator remains as the original.
            idToMarketItem[itemId].creator,
            price,
            true,
            address(this)
        );

        
    }

    /**
     * Lets someone who bought an NFT list it on the marketplace
     * Relisting
     * NOTE: NFTContract.approve needs to be called in order for this to work.
     */
    function listMarketItem(
        address nftContract,
        uint256 itemId,
        uint256 price,
        uint256 royalty,
        string memory title,
        string  memory description
        //Reentrancy guard prevents attacks, also stops out anyone listing for too low prices.
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == mintingRoyalty, "Price must be equal to listing price");
        MarketItem storage _item = idToMarketItem[itemId];
        _item.owner = payable(address(this)); //The item is coming back to us, so we regain ownership of the nft
        _item.price = price;
        _item.seller = payable(msg.sender); //Seller is whoever is listing the NFT again.
        _item.sold = false;
        _itemsSold.decrement(); //Debatebale. As it is a relisting technically our items sold goes down and then goes up when the item is sold again.
        _item.seller.sendValue(msg.value); //We send back the listing fee to the user, as they already paid it once
        IERC721(nftContract).safeTransferFrom(msg.sender, address(this), _item.tokenId); //The item is coming back to us, so we regain ownership of the nft

        //Recreates the listing
        emit MarketItemListed(
            title,
            description,
            itemId,
            nftContract,
            _item.tokenId,
            royalty,
            msg.sender,
            address(this),
            _item.creator,
            price,
            false
        );
    }

    /**
     * Lets seller of a currently listed item update the price.
     */
    function updateMarketItemPrice(
        address nftContract,
        uint256 itemId,
        uint256 price,
        uint256 royalty,
        string memory title,
        string  memory description
        //Reentrance guard again
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        MarketItem storage _item = idToMarketItem[itemId];
        //Seller of item must be the person making the request to change the listing price.
        require(
            _item.seller == _msgSender(),
            "Caller is not the item's seller and cannot change the price"
        );
        //If item doesn't belong to us (not listed) you cannot updated the price.
        require(
            _item.owner == address(this),
            "You can only update the price of a listed item"
        );

        _item.price = price;

        emit MarketItemPriceChanged(
            title,
            description,
            itemId,
            nftContract,
            _item.tokenId,
            royalty,
            _item.seller,
            _item.owner,
            _item.creator,
            price,
            false
        );
    }

    /// All the following are views.
    /// FETCH FUNCTIONS
    ///

    /**
     * Fetches an item based on the passed-in ID.
     */
    function fetchItemForId(uint256 itemId)
        public
        view
        returns (MarketItem memory)
    {
        require(itemId <= _itemIds.current(), "itemId must be valid");
        return idToMarketItem[itemId];
    }

    /**
     * Fetches only items a user has created
     */
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        return _fetchNfts(msg.sender, this._getCreator);
    }

    function fetchItemsCreatedBy(address addr)
        public
        view
        returns (MarketItem[] memory)
    {
        return _fetchNfts(addr, this._getCreator);
    }

    /**
     * Fetches only items a user is selling in the marketplace.
     */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        return _fetchNfts(msg.sender, this._getSeller);
    }

    function fetchItemsListedBy(address addr)
        public
        view
        returns (MarketItem[] memory)
    {
        return _fetchNfts(addr, this._getSeller);
    }

    /**
     * Fetches all unsold market items
     */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        return _fetchNfts(address(this), this._getOwner);
    }

    /**
     * Fetches items that a user currently owns.
     * A user owns an NFT if they purchased it and have not listed it back on the marketplace.
     */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        return _fetchNfts(msg.sender, this._getOwner);
    }

    function fetchItemsOwnedBy(address addr)
        public
        view
        returns (MarketItem[] memory)
    {
        return _fetchNfts(addr, this._getOwner);
    }

    ///
    /// MISC
    ///

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    ///
    /// PRIVATE/INTERNAL FUNCTIONS
    ///

    function _fetchNfts(
        address addr,
        function(MarketItem memory) external pure returns (address) getAddr
    ) private view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (getAddr(idToMarketItem[i + 1]) == addr) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (getAddr(idToMarketItem[i + 1]) == addr) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Doesn't work if this function is internal, not sure why
    function _getCreator(MarketItem memory marketItem)
        external
        pure
        returns (address)
    {
        return marketItem.creator;
    }

    // Doesn't work if this function is internal, not sure why
    function _getOwner(MarketItem memory marketItem)
        external
        pure
        returns (address)
    {
        return marketItem.owner;
    }

    // Doesn't work if this function is internal, not sure why
    function _getSeller(MarketItem memory marketItem)
        external
        pure
        returns (address)
    {
        return marketItem.seller;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        // See https://docs.openzeppelin.com/contracts/2.x/api/token/erc721#ERC721-safeTransferFrom-address-address-uint256-
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }
}