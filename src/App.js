import { useEffect, useState } from "react";
import "./App.css";
import {
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import {
  BrowserProvider,
  Contract,
  parseEther,
  isCallException,
  isError,
  ErrorDescription,
  ErrorFragment,
  checkResultErrors,
} from "ethers";

const USDTAddress = "0x1C847C372bF87Fc8111Fb2cbdec57E8c64637698";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [
  "function retrieveValue() view returns (uint)",
  "function storeValue(uint256 _value)",
  "function deposit() public payable",
];

function App() {
  const [inputValue, setInputValue] = useState("");
  const [storedValue, setStoredValue] = useState(0);
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const { open } = useWeb3Modal();

  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDepositAmountChange = (e) => {
    setDepositAmount(e.target.value);
  };

  const handleStoreValue = () => {
    // setStoredValue(inputValue);
    setStore(inputValue);
  };

  const handleDepositEther = async () => {
    // alert(`Depositing ${depositAmount} ETH`);
    await deposit();
  };

  const handleWithdrawEther = () => {
    alert("Withdrawing all ETH");
  };

  const connectWallet = () => {
    alert("Connecting wallet...");
  };

  async function getBalance() {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const USDTContract = new Contract(USDTAddress, USDTAbi, signer);
    const USDTBalance = await USDTContract.retrieveValue();
    setStoredValue(Number(USDTBalance));
  }

  async function setStore() {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const USDTContract = new Contract(USDTAddress, USDTAbi, signer);
    const USDTBalance = await USDTContract.storeValue(storedValue);

    // console.log(USDTBalance, "USDTBalance form value: " + USDTBalance);
  }

  async function deposit() {
    try {
      if (!isConnected) throw new Error("User disconnected");

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      // The Contract object
      const USDTContract = new Contract(USDTAddress, USDTAbi, signer);

      // Convert the deposit amount to Wei
      // const depositValue = parseEther(depositAmount);

      try {
        // Send the transaction
        const transaction = await USDTContract.deposit({
          value: depositAmount,
        });
        await transaction.wait();
      } catch (e) {
        // console.log("DDDD : ", e, e.toString());
        if (isError(e, "CALL_EXCEPTION")) {
          // The Type Guard has validated this object
          console.log("RAHUL", e);
        } else {
          console.log("YY : ", e);
        }
      }

      // try {
      //   // Send the transaction
      //   const transaction = await USDTContract.deposit({
      //     value: depositAmount,
      //   });
      //   await transaction.wait();
      // } catch (e) {
      //   console.log("DDDD : ", e);
      //   if (isError(e, "INSUFFICIENT_FUNDS")) {
      //     // The Type Guard has validated this object
      //     console.log("RAHUL", e);
      //   }
      // }

      // await USDTContract.deposit.staticCall("ethers.eth", amount)

      // Wait for the transaction to be mined
      // await transaction.wait();

      // alert("Deposit successful!");
    } catch (error) {
      console.error("Error during deposit:", error);
    }
  }

  // async function deposit() {
  //   try {
  //     if (!isConnected) throw new Error("User disconnected");

  //     const ethersProvider = new BrowserProvider(walletProvider);
  //     const signer = await ethersProvider.getSigner();
  //     // The Contract object
  //     const USDTContract = new Contract(USDTAddress, USDTAbi, signer);

  //     // Convert the deposit amount to Wei
  //     const depositValue = parseEther(depositAmount);

  //     // Send the transaction
  //     const transaction = await USDTContract.deposit({
  //       value: depositValue,
  //     });

  //     // Wait for the transaction to be mined
  //     await transaction.wait();

  //     alert("Deposit successful!");
  //   } catch (error) {
  //     console.error("Error during deposit:", error);
  //     alert(`Failed to deposit: ${error.message}`);
  //   }
  // }

  useEffect(() => {
    async function fetch() {
      let data = await getBalance();
    }
    if (isConnected) {
      fetch();
    }
  }, [storedValue]);

  console.log(isConnected, address, chainId);

  return (
    <div className="App">
      <div className="simple-storage-container">
        <h1>Simple Storage DApp</h1>

        <button onClick={() => open()}>
          {address ? `Connected: ${address}` : "Connect Wallet"}
        </button>
        {/* <button onClick={() => open({ view: "Networks" })}>
          Open Network Modal
        </button> */}
        <div className="stored-value-section">
          <h2>Stored Value: {storedValue}</h2>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter value to store"
          />
          <button onClick={handleStoreValue}>Store Value</button>
        </div>
        <div className="balance-section">
          <h2>Contract Balance: {balance} ETH</h2>
          <input
            type="number"
            value={depositAmount}
            onChange={handleDepositAmountChange}
            placeholder="Enter amount to deposit"
          />
          <button onClick={handleDepositEther}>Deposit ETH</button>
          <button onClick={handleWithdrawEther}>Withdraw</button>
        </div>
      </div>
    </div>
  );
}

export default App;
