/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AUTH_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS,
    FOOD_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_FOOD_CONTRACT_ADDRESS,
    SERVER: process.env.NEXT_PUBLIC_SERVER,
  }
}

module.exports = nextConfig
