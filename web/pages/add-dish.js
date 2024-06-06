import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Web3 from "web3";
import abi from "../utils/abi";

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
                const serverUrl = process.env.NEXT_PUBLIC_SERVER;
                const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

                const web3Instance = new Web3(new Web3.providers.HttpProvider(serverUrl));
                const foodContract = new web3Instance.eth.Contract(abi, contractAddress);
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
                const accounts = await web3.eth.getAccounts();
                const receipt = await contract.methods
                    .addFood(formInput.fileUrl, formInput.name, formInput.originCountry)
                    .send({ from: accounts[0] });

                console.log('Food added:', receipt);
                router.push('/');
            } catch (error) {
                console.error("Failed to add food", error);
                setError(error);
            }
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="URL Food"
                    className="mt-8 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, fileUrl: e.target.value })
                    }
                />
                <input
                    placeholder="Food name"
                    className="mt-2 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                    }
                />
                <input
                    placeholder="Origin Country"
                    className="mt-2 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, originCountry: e.target.value })
                    }
                />
                <button
                    onClick={addDish}
                    className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg"
                >
                    Add food
                </button>
                {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
            </div>
        </div>
    );
}
