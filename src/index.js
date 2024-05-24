import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// 1. Get projectId
const projectId = "8dc5f450bfc5d077df4123e8300f3568";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const bscTestnet = {
  chainId: 97,
  name: "Binance Smart Chain Testnet",
  currency: "BNB",
  explorerUrl: "https://testnet.bscscan.com",
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
};

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [bscTestnet, mainnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
