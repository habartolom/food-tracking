const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AuthModule", (m) => {
    const auth = m.contract("Auth");
    return { auth };
});
