// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public marketAddress;

    event Minted(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI,
        string uuid
    );

    constructor(address marketplaceAddress) ERC721("PixelPlaza", "PXZ") {
        marketAddress = marketplaceAddress;
    }

    function setMarketAddress(address newMarketAddress) public onlyOwner {
        marketAddress = newMarketAddress;
    }

    function createToken(string memory tokenURI, string memory uuid)
        public
        returns (uint256)
    {
        //Increments the token ID's then sets the incremented ID as the new items ID
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        //Mints, sets the URI and approval for the new token.
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(marketAddress, true);
        //emit logs transactions on the blockchain, these are then accessible later.
        emit Minted(address(0), msg.sender, newItemId, tokenURI, uuid);

        return newItemId;
    }
}