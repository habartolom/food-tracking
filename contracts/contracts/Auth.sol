// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Auth {
    struct User {
        string username;
        bytes32 passwordHash;
        address userAddress;
    }

    mapping(address => User) private users;
    mapping(string => address) private usernames;

    event UserRegistered(address userAddress, string username);
    event UserLoggedIn(address userAddress, string username);

    function register(string calldata _username, string calldata _password) public {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_password).length > 0, "Password cannot be empty");
        require(users[msg.sender].userAddress == address(0), "Address already registered");
        require(usernames[_username] == address(0), "Username already taken");

        bytes32 passwordHash = keccak256(abi.encodePacked(_password));

        User memory newUser = User({
            username: _username,
            passwordHash: passwordHash,
            userAddress: msg.sender
        });

        users[msg.sender] = newUser;
        usernames[_username] = msg.sender;

        emit UserRegistered(msg.sender, _username);
    }

    function login(string calldata _username, string calldata _password) public view returns (address) {
        address useraddress = usernames[_username];
        User memory user = users[useraddress];
        require(user.userAddress != address(0), "User not found");

        bytes32 passwordHash = keccak256(abi.encodePacked(_password));
        require(user.passwordHash == passwordHash, "Invalid password");

        return user.userAddress;
    }

    function getUser(address _userAddress) public view returns (string memory, address) {
        User memory user = users[_userAddress];
        require(user.userAddress != address(0), "User not found");

        return (user.username, user.userAddress);
    }
}
