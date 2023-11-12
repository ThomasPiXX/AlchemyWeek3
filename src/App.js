import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import {ethers} from 'ethers';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [publicKeyBalance, setPublicKeyBalance] = useState('');
  const [publicKeyTransaction, setPublicKeyTransaction] = useState('');
  const [balance, setBalance] = useState(null);
  const [transactions,  setTransaction] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      try{
        const response = await alchemy.core.getBlockNumber();
        console.log('block Number Response:', response);
        setBlockNumber(response);
      } catch (error) {
        console.error('error retrieving block number:', error)
      }
    }
    getBlockNumber();
  },[]);

  const handleInputChange = (e) => {
    setPublicKeyBalance(e.target.value);
  }

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    try {
      const response = await alchemy.core.getBalance(publicKeyBalance);
  
      if (response && response._hex) {
        const balanceValue = response._hex;
  
        const formattedBalance = ethers.formatUnits(balanceValue, 18);
  
        setBalance(formattedBalance);
      } else {
        console.error('Invalid balance response:', response);
      }
    } catch (error) {
      console.error('Error retrieving balance:', error);
    }
  };
  const handleInputChange2 = (e) => {
    setPublicKeyTransaction(e.target.value);
  }

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try{
      const transactions = await alchemy.core.getTransactionCount(publicKeyTransaction);

      setTransaction(transactions);
    }catch (error) {
      console.error("error retrieving transactions:", error.message);
      throw error;
    }
  }

  return ( 
  <div className="App">
  <div>Block Number: {blockNumber}/</div>
  
  <form onSubmit={handleSubmit1}>
    <label>
      Enter your wallet public key:
      <input
      type = "text"
      value ={publicKeyBalance}
      onChange={handleInputChange}
      />
    </label>
    <button type="submit">Get Balance</button>
  </form>
    {balance && <div>Balance: {balance}</div>}


    <form onSubmit={handleSubmit2}>
        <label>Enter PublicKey to know how much transactions that account have executed</label>
        <input type="text" value={publicKeyTransaction} onChange={handleInputChange2} />
        <button type="submit">Get Transactions</button>
      </form>
      {transactions && (
        <div>
          Transaction:
          <pre>{JSON.stringify(transactions, null, 2)}</pre>
        </div>
      )}
    </div>      
  );
}

export default App;
