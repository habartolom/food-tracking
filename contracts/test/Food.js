const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Food", function () {
  it("Add a new dish", async function () {
    const [owner1, owner2, owner3] = await ethers.getSigners();
    const Food = await ethers.getContractFactory("Food");
    const food = await Food.deploy();

    var addFood = await food
      .connect(owner2)
      .addFood(
      "https://www.lima2019.pe/sites/default/files/inline-images/preview-gallery-006_0.jpg",
      "Ceviche",
      "Perú"
    );

    await addFood.wait();

    var addFood2 = await food
      .connect(owner3)
      .addFood(
        "https://www.lima2019.pe/sites/default/files/inline-images/preview-gallery-004_0.jpg",
        "Lomo Saltado",
        "Colombia"
      );

    await addFood2.wait();

    const foods = await food.getAllFoods();
    expect(foods.length).to.equal(2);

    const foodsByOwner1 = await food.connect(owner1).getFoodsByOwner();
    expect(foodsByOwner1.length).to.equal(0);

    const foodsByOwner2 = await food.connect(owner2).getFoodsByOwner();
    expect(foodsByOwner2.length).to.equal(1);

    const foodsByOwner3 = await food.connect(owner3).getFoodsByOwner();
    expect(foodsByOwner3.length).to.equal(1);
  });
});