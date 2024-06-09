const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Auth", function () {
    async function deployAuthFixture() {
        const [deployer, otherAccount] = await ethers.getSigners();
        const Auth = await ethers.getContractFactory("Auth");
        const auth = await Auth.deploy();
        return { auth, deployer, otherAccount };
    }

    describe("Register and Login", function () {
        it("Should register a user", async function () {
            const { auth, deployer } = await loadFixture(deployAuthFixture);

            const registerTx = await auth.connect(deployer).register(
                "habartolom",
                "Test1234!"
            );

            await registerTx.wait();

            const user = await auth.getUser(deployer.address);

            expect(user[0]).to.equal("habartolom");
            expect(user[1]).to.equal(deployer.address);
        });

        it("Should fail to register with the same address", async function () {
            const { auth, deployer } = await loadFixture(deployAuthFixture);

            await auth.register("habartolom", "Test1234!");

            await expect(
                auth.register("anotheruser", "password123")
            ).to.be.revertedWith("Address already registered");
        });

        it("Should fail to register with the same username", async function () {
            const { auth, deployer, otherAccount } = await loadFixture(deployAuthFixture);

            await auth.connect(deployer).register("habartolom", "Test1234!");

            await expect(
                auth.connect(otherAccount).register("habartolom", "password123")
            ).to.be.revertedWith("Username already taken");
        });

        it("Should login a user", async function () {
            const { auth, deployer } = await loadFixture(deployAuthFixture);

            await auth.connect(deployer).register("habartolom", "Test1234!");

            const userAddress = await auth.login("habartolom", "Test1234!");

            expect(userAddress).to.equal(deployer.address);
        });

        it("Should fail to login with incorrect password", async function () {
            const { auth, deployer } = await loadFixture(deployAuthFixture);

            await auth.connect(deployer).register("habartolom", "Test1234!");

            await expect(
                auth.login("habartolom", "wrongpassword")
            ).to.be.revertedWith("Invalid password");
        });

        it("Should fail to login with unregistered username", async function () {
            const { auth } = await loadFixture(deployAuthFixture);

            await expect(
                auth.login("nonexistentuser", "password123")
            ).to.be.revertedWith("User not found");
        });
    });
});


