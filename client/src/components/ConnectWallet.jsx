import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './ConnectWallet.css'

const ConnectWallet = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };
    initWeb3();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        console.log('Wallet connected');
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask not detected');
    }
  };

  return (
    <div>
      {account ? (
        <p>Wallet Connected: {account.slice(0, 5)}</p>
      ) : (
        <button className="connect-wallet-button" onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
