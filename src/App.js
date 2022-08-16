import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Wallet from './artifacts/contracts/Wall3t.sol/Wall3t.json';
import './App.css';

let WalletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {

  const [balance, setBalance] = useState(0);
  const [amountSend, setAmountSend] = useState();
  const [amountWithdraw, setAmountWithdraw] = useState();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getBalance();
  }, [])

  async function getBalance() {
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider);
      try {
        let overrides = {
          from: accounts[0]
        }
        const data = await contract.getBalance(overrides);
        setBalance(String(data));
      }
      catch(err) {
        setError('An error has occured');
      }
    }
  }

  async function transfer() {
    if(!amountSend) {
      return;
    }
    setError('');
    setSuccess('');
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend)
        }
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();
        setAmountSend('');
        getBalance();
        setSuccess('Your money has been add in your wallet!')
      }
      catch(err) {
        setError('An error has occured');
      }
    }
  }

  async function withdraw() {
    if(!amountWithdraw) {
      return;
    }
    setError('');
    setSuccess('');
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
    try {
      const transaction = await contract.withdrawMoney(accounts[0], ethers.utils.parseEther(amountWithdraw));
      await transaction.wait();
      setAmountWithdraw('');
      getBalance();
      setSuccess('Your money has been removed from your wallet!');
    }
    catch(err) {
      setError('An error has occured');
    }
  }

  function changeAmountSend(e) {
    setAmountSend(e.target.value);
  }

  function changeAmountWithdraw(e) {
    setAmountWithdraw(e.target.value);
  }

  return (
    <div className="App">
      <div className="container">
        <div className="logo">
          <i className="fab fa-ethereum"></i>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <h2>{balance / 10**18} <span className="eth">eth</span></h2>
        <div className="wallet__flex">
          <div className="walletG">
            <h3>Send ETH</h3>
            <input type="text" placeholder="Amount in Ethers" onChange={changeAmountSend} />
            <button onClick={transfer}>Send</button>
          </div>
          <div className="walletD">
            <h3>Withdraw Eth</h3>
            <input type="text" placeholder="Amount in Ethers" onChange={changeAmountWithdraw} />
            <button onClick={withdraw}>Withdraw</button>
          </div>
          
        </div>
        <p id='ps'>by morphe3s(mass)</p>

      </div>
    </div>
  );
}

export default App;