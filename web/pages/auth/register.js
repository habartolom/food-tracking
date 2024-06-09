// pages/register.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { env } from "../../next.config";
import authAbi from "../../utils/authAbi";

export default function Register() {
  const [web3, setWeb3] = useState(null);
  const [authContract, setAuthContract] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const serverUrl = env.SERVER;
        const contractAddress = env.AUTH_CONTRACT_ADDRESS;

        if (!serverUrl || !contractAddress) {
          throw new Error("Please set NEXT_PUBLIC_SERVER and NEXT_PUBLIC_CONTRACT_ADDRESS in your .env.local file");
        }

        const web3Instance = new Web3(new Web3.providers.HttpProvider(serverUrl));
        const authContract = new web3Instance.eth.Contract(authAbi, contractAddress);

        setWeb3(web3Instance);
        setAuthContract(authContract);

      }
      catch (error) {
        console.error("Failed to initialize web3 or contract", error);
        setError(error);
      }
    };

    initWeb3();
  }, []);

  const getSignerAddressAsync = async () => {
    const USER_NOT_FOUND = 'User not found'

    const accounts = await web3.eth.getAccounts();
    const userPromises = accounts.map(address =>
      authContract.methods.getUser(address).call()
        .then(user => ({ address, username: user[0], userAddress: user[1] }))
        .catch(error => ({ address, error: error.message }))
    );

    const userData = await Promise.all(userPromises);

    const user = userData.find(x => x.error?.includes(USER_NOT_FOUND));
    if (!user) throw new Error("No es posible en este momento el registro");

    return user.address;
  }

  const handleRegister = async () => {

    const USERNAME_ALREADY_TAKEN = 'Username already taken'

    try {
      if (!username || !password) {
        setError("All fields are required");
        return;
      }

      const signer = await getSignerAddressAsync();
      await authContract.methods.register(username, password).send({ from: signer });
      setSuccess("Registro exitoso!");
      setError(null);

      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    }
    catch (error) {
      if (error.message.includes(USERNAME_ALREADY_TAKEN)){
        setError("El username ya ha sido tomado, intente con uno nuevo");
      }
      else{
        setError(error.message);
      }

      console.error("Failed to register", error);
      setSuccess(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
      </div>
      <div className="mb-4">
        <button onClick={handleRegister} className="bg-blue-500 text-white p-2">Register</button>
      </div>
    </div>
  );
}
