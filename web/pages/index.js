import { useEffect, useState } from "react";
import Web3 from "web3";
import abi from "../utils/abi";

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER;
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        
        const web3Instance = new Web3(new Web3.providers.HttpProvider(serverUrl));
        const foodContract = new web3Instance.eth.Contract(abi, contractAddress);
        setWeb3(web3Instance);
        setContract(foodContract);

        // Fetch all dishes once the contract is set
        const foods = await foodContract.methods.getAllFoods().call();
        setDishes(foods);
      } catch (error) {
        console.error("Failed to initialize web3 or contract", error);
        setError(error);
      }
    };
    initWeb3();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {dishes.map((food, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img style={{ height: "20rem" }} src={food.foodUrl} alt={food.foodName} />
              <div className="p-4">
                <p style={{ height: "64px" }} className="text-2xl font-semibold">{food.foodName}</p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p>{food.originCountry}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
