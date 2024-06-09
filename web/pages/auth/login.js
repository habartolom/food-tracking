// pages/login.js
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Web3 from "web3";
import { env } from "../../next.config";
import authAbi from "../../utils/authAbi";
import { AuthContext } from "../_app";

export default function Login() {
    const [web3, setWeb3] = useState(null);
    const [authContract, setAuthContract] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();
    const { setIsAuthenticated } = useContext(AuthContext);

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
            } catch (error) {
                console.error("Failed to initialize web3 or contract", error);
                setError(error.message);
            }
        };

        initWeb3();
    }, []);

    const handleLogin = async () => {
        const USER_NOT_FOUND = "User not found";
        const INVALID_PASSWORD = "Invalid password";

        try {
            if (!username || !password) {
                setError("All fields are required");
                return;
            }

            const userAddress = await authContract.methods.login(username, password).call();
            console.log(userAddress)
            localStorage.setItem("userAddress", userAddress);
            setIsAuthenticated(true);
            setSuccess("Login successful!");

            setTimeout(() => {
                router.push("/my-dishes");
            }, 1000);
        } catch (error) {
            if (error.message.includes(USER_NOT_FOUND)) {
                setError("Credenciales inválidas");
            } else if (error.message.includes(INVALID_PASSWORD)) {
                setError("Credenciales inválidas");
            } else {
                setError("En este momento no es posible acceder");
            }

            console.error("Failed to login", error);
            setSuccess(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
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
                <button onClick={handleLogin} className="bg-blue-500 text-white p-2">Login</button>
            </div>
        </div>
    );
}
