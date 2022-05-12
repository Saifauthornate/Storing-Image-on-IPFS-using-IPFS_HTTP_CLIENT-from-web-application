// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract MyNft is ERC721URIStorage {
    
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	uint public price= .1 ether;
	constructor()  ERC721("AuthorNate", "ANT"){
	
	}

	function mintNFT(address payable to,string memory tokenURI ) public returns(uint256){
		
		require(_tokenIds.current()<=20,"You can Only Mint 20 NFTs");

        _tokenIds.increment();
		uint256 newTokenId = _tokenIds.current();

		_mint(to, newTokenId);

		_setTokenURI(newTokenId,tokenURI);
		
		return newTokenId;
	}
	
	function buyNFT(uint256 tokenId ) public payable {

            require (msg.value==price,"Increase Your Bid");
			payable(ownerOf(tokenId)).transfer(price);
          
			_transfer(ownerOf(tokenId) , msg.sender , tokenId);	
	}
}


//NFT Contract is Deployed to: 0xDc5F8215Ce96217832509755f316ab8E294087C1