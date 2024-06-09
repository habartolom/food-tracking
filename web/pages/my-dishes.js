import { useEffect, useState } from "react";
import Web3 from "web3";
import { env } from "../next.config";
import styles from "../styles/Home.module.css";
import foodAbi from "../utils/foodAbi";

export default function MyDishes() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const serverUrl = env.SERVER;
        const foodContractAddress = env.FOOD_CONTRACT_ADDRESS;

        const web3Instance = new Web3(new Web3.providers.HttpProvider(serverUrl));
        const foodContract = new web3Instance.eth.Contract(foodAbi, foodContractAddress);

        setWeb3(web3Instance);
        setContract(foodContract);

        const signer = localStorage.getItem('userAddress');
        const foods = await foodContract.methods.getFoodsByOwner().call({ from: signer });
        setDishes(foods);
      } catch (error) {
        console.error("Failed to initialize web3 or contract", error);
        setError(error);
      }
    };

    initWeb3();
  }, []);

  return (
    <div className={styles.container}>
      <div className="flex justify-center my-4">
        <p className={styles.title}>Mis Platillos</p>
      </div>
      <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          {error && <p className="text-red-500">Error: {error.message}</p>}
          <div className={styles.grid}>
            {dishes.map((food, i) => (
              <div key={i} className={styles.card}>
                <img className="w-full object-cover" src={food.foodUrl} alt={food.foodName} />
                <div className="p-4">
                  <p className="text-2xl font-semibold">{food.foodName}</p>
                  <div className="text-gray-500">{food.originCountry}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
