const foodAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "foodUrl",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "foodName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "originCountry",
				"type": "string"
			}
		],
		"name": "addFood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllFoods",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "foodUrl",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "foodName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "originCountry",
						"type": "string"
					}
				],
				"internalType": "struct Food.FoodItem[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getFoodsByOwner",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "foodUrl",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "foodName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "originCountry",
						"type": "string"
					}
				],
				"internalType": "struct Food.FoodItem[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export default foodAbi;