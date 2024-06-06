const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Food", function () {
  it("Add a new dish", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Food = await ethers.getContractFactory("Food");
    const food = await Food.deploy();

    var addFood = await food.addFood(
      "https://www.lima2019.pe/sites/default/files/inline-images/preview-gallery-006_0.jpg",
      "Ceviche",
      "Perú"
    );

    await addFood.wait();

    var addFood2 = await food
      .connect(addr1)
      .addFood(
        "https://www.lima2019.pe/sites/default/files/inline-images/preview-gallery-004_0.jpg",
        "Lomo Saltado",
        "Colombia"
      );

    await addFood2.wait();

    var foods = await food.getAllFoods();
    expect(foods.length).to.equal(2);

    var foodsByOwner = await food.getFoodsByOwner();
    expect(foodsByOwner.length).to.equal(1);
  });
});