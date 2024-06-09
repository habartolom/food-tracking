import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { env } from "../next.config";
import foodAbi from "../utils/foodAbi";

export default function AddDish() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();
    const [formInput, updateFormInput] = useState({
        fileUrl: "",
        name: "",
        originCountry: "",
    });

    useEffect(() => {
        const initWeb3 = async () => {
            try {
                const serverUrl = env.SERVER;
                const foodContractAddress = env.FOOD_CONTRACT_ADDRESS;

                if (!serverUrl || !foodContractAddress) {
                    throw new Error("Server URL or Contract Address is not defined");
                }

                const web3Instance = new Web3(new Web3.providers.HttpProvider(serverUrl));
                const foodContract = new web3Instance.eth.Contract(foodAbi, foodContractAddress);
                setWeb3(web3Instance);
                setContract(foodContract);
            } catch (error) {
                console.error("Failed to initialize web3 or contract", error);
                setError(error);
            }
        };

        initWeb3();
    }, []);

    const addDish = async () => {
        if (web3 && contract) {
            try {
                const signer = localStorage.getItem('userAddress');
                await contract.methods
                    .addFood(formInput.fileUrl, formInput.name, formInput.originCountry)
                    .send({ from: signer });

                router.push('/my-dishes');
            } catch (error) {
                console.error("Failed to add food", error);
                setError(error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-center my-4">
                <p className="text-2xl font-bold">Agregar platillo</p>
            </div>
            <div className="flex justify-center">
                <div className="w-1/2 flex flex-col pb-12">
                    <input
                        placeholder="URL"
                        className="mt-8 border rounded p-4"
                        onChange={(e) =>
                            updateFormInput({ ...formInput, fileUrl: e.target.value })
                        }
                    />
                    <input
                        placeholder="Nombre del Platillo"
                        className="mt-2 border rounded p-4"
                        onChange={(e) =>
                            updateFormInput({ ...formInput, name: e.target.value })
                        }
                    />
                    <input
                        placeholder="País de Origen"
                        className="mt-2 border rounded p-4"
                        onChange={(e) =>
                            updateFormInput({ ...formInput, originCountry: e.target.value })
                        }
                    />
                    <button
                        onClick={addDish}
                        className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg"
                    >
                        Añadir
                    </button>
                    {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
                </div>
            </div>
        </div>
    );
}
