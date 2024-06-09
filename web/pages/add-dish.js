import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { env } from "../next.config";
import styles from "../styles/Home.module.css";
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
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex justify-center my-4">
        <p className={styles.title}>Agregar platillo</p>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-md flex flex-col pb-12">
          <input
            placeholder="URL"
            className="mt-8 border rounded p-4 w-full"
            onChange={(e) =>
              updateFormInput({ ...formInput, fileUrl: e.target.value })
            }
          />
          <input
            placeholder="Nombre del Platillo"
            className="mt-2 border rounded p-4 w-full"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <input
            placeholder="País de Origen"
            className="mt-2 border rounded p-4 w-full"
            onChange={(e) =>
              updateFormInput({ ...formInput, originCountry: e.target.value })
            }
          />
          <button
            onClick={addDish}
            className="font-bold mt-4 bg-yellow-600 text-white rounded p-4 shadow-lg hover:bg-yellow-700 w-full"
          >
            Añadir
          </button>
          {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
        </div>
      </div>
    </div>
  );
}
