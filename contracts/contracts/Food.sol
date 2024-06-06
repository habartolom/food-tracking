//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Food {
    constructor() {}

    struct FoodItem {
        address owner;
        string foodUrl;
        string foodName;
        string originCountry;
    }

    FoodItem[] private foods;

    function addFood(
        string memory foodUrl,
        string memory foodName,
        string memory originCountry
    ) public {
        foods.push(
            FoodItem(msg.sender, foodUrl, foodName, originCountry)
        );
    }

    function getAllFoods() public view returns (FoodItem[] memory) {
        return foods;
    }

    function getFoodsByOwner()
        public
        view
        returns (FoodItem[] memory)
    {
        uint256 itemCount = 0;

        for (uint256 i = 0; i < foods.length; i++) {
            if (foods[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        FoodItem[] memory myfoods = new FoodItem[](itemCount);
        for (uint256 i = 0; i < foods.length; i++) {
            if (foods[i].owner == msg.sender) {
                myfoods[i] = foods[i];
            }
        }

        return myfoods;
    }
}