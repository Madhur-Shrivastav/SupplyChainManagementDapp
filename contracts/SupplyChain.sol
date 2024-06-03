// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SupplyChain is ERC721URIStorage, Ownable {

    constructor() ERC721("SupplyChainProduct", "SCP") Ownable(msg.sender){
        manager = msg.sender;
    }

    uint256 public current_Id;
    address public manager;
    uint256 constant private deleteTime = 60; // in seconds

    event ManagerEvent(string message);

    modifier notManager() {
        require(msg.sender != owner(), "You are the manager!");
        emit ManagerEvent("You are the manger!");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == owner(), "You are not the manager!");
        emit ManagerEvent("You are not the manger!");
        _;
    }

    struct Status {
        string status;
        uint256 timestamp;
    }

    struct Product {
        uint256 id;
        string name;
        address owner;
        uint256 price;
        bool bought;
        string imageURL;
        uint256 purchaseTime;
        Status[] statusHistory;
    }

    mapping(uint256 => Product) public products;
    Product [] public allProducts;

    event StatusUpdated(uint256 indexed productId, string newStatus, uint256 timestamp);
    event ProductDeleted(address indexed remover,uint256 indexed productId);
    event ProductPurchased(uint256 indexed productId, address indexed buyer, uint256 price);

    function registerProduct(string memory _name, string memory _tokenURI, uint256 _price) public notManager {
        _mint(msg.sender, current_Id);
        _setTokenURI(current_Id, _tokenURI);

        Status memory newStatus = Status({
            status: "Registered",
            timestamp: block.timestamp
        });

        Product storage newProduct = products[current_Id];
        newProduct.id = current_Id;
        newProduct.name = _name;
        newProduct.owner = msg.sender;
        newProduct.price = _price;
        newProduct.imageURL = _tokenURI;
        newProduct.bought = false;
        newProduct.purchaseTime = 0;
        newProduct.statusHistory.push(newStatus);

        allProducts.push(newProduct);
        current_Id ++;

        emit StatusUpdated(current_Id, "Registered", block.timestamp);
    }

    function tokenExists(uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) != address(0);

    }


    function purchaseProduct(uint256 _productId) public payable notManager{
        products[_productId].statusHistory.push(Status("Purchase pending...", block.timestamp));
        require(tokenExists(_productId), "Product ID does not exist");
        require(!products[_productId].bought,"The product has been purchased");
        require(msg.value == products[_productId].price, "Incorrect payment amount");
        require(ownerOf(_productId) != msg.sender, "Buyer cannot be the current owner");

        address previousOwner = ownerOf(_productId);
        _transfer(previousOwner, msg.sender,_productId);

        payable(previousOwner).transfer(msg.value);

        products[_productId].owner = msg.sender;
        products[_productId].purchaseTime = block.timestamp;
        products[_productId].bought = true;
        products[_productId].statusHistory.push(Status("Purchased", block.timestamp));

        emit StatusUpdated(_productId, "Purchased", block.timestamp);
        emit ProductPurchased(_productId, msg.sender, msg.value);

    }

    function deleteBoughtProducts() public onlyManager {
    uint256 totalProducts = current_Id;

    for (uint256 i = 0; i < totalProducts; i++) {
        if (tokenExists(i) && products[i].bought) {
            _burn(i);
            delete products[i];
            emit ProductDeleted(msg.sender, i);
        }
    }
    }

    function getProductById(uint256 _productId) public view returns (Product memory) {
        require(tokenExists(_productId), "Product ID does not exist");
        return products[_productId];
    }

    function getProducts() public view returns (Product[] memory) {
        uint256 totalProducts = current_Id;
        uint256 existingProductsCount = 0;

        for (uint256 i = 0; i < totalProducts; i++) {
            if (tokenExists(i)) {
                existingProductsCount++;
            }
        }

        Product[] memory existingProducts = new Product[](existingProductsCount);
        uint256 index = 0;

        for (uint256 i = 0; i < totalProducts; i++) {
            if (tokenExists(i)) {
                existingProducts[index] = products[i];
                index++;
            }
        }

        return existingProducts;
    }

    function getManager() public view returns (address) {
        return manager;
    }
}


//OnePlus Earbuds,EarbudsURI,1
//OnePlus 8,PhoneURI,5
//iPhone 13,iPhoneURI,10