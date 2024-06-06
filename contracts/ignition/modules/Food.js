const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FoodModule", (m) => {
    const food = m.contract("Food");
    return { food };
});
