import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import REITManagementABI from '../../constants/REITManagementABI.json'; // Import the compiled contract ABI
import './PayRentApp.css';

const REITManagementAddress = '0x26375DdD53bC9a61d765172BF53A27D689657b40'; // Address of your deployed contract

const PayRentApp = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [month, setMonth] = useState('');
  const [rentAmount, setRentAmount] = useState('');

  useEffect(() => {
    const init = async () => {
      // Connect to Metamask or any other Ethereum provider
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Get the current connected account
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          // Load the contract
          const instance = new web3Instance.eth.Contract(
            REITManagementABI,
            REITManagementAddress
          );
          setContract(instance);
        } catch (error) {
          console.error(error);
        }
      }
    };
    init();
  }, []);

  const handlePayRent = async () => {
    try {
      await contract.methods.payRent(propertyId, month, web3.utils.toWei(rentAmount, 'ether')).send({ from: account });
      alert('Rent paid successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to pay rent. Please check the console for details.');
    }
  };

  return (
    <div className="pay-rent-container">
      <h1>Pay Rent</h1>
      <input className="pay-rent-input" type="text" value={propertyId} onChange={(e) => setPropertyId(e.target.value)} placeholder="Property ID" />
      <input className="pay-rent-input" type="text" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month" />
      <input className="pay-rent-input" type="text" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder="Rent Amount (ETH)" />
      <button className="pay-rent-button" onClick={handlePayRent}>Pay Rent</button>
    </div>
  );
};

export default PayRentApp;
