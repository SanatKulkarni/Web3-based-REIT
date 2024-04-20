import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import REITManagementABI from '../../constants/REITManagementABI.json'; // ABI generated from your Solidity contract
import './ListPropertyOwner.css';

const REITManagementAddress = '0x26375DdD53bC9a61d765172BF53A27D689657b40'; // Address of your deployed contract

const ListPropertyOwner = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [ipfsHash, setIpfsHash] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const contractInstance = new web3Instance.eth.Contract(REITManagementABI, REITManagementAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };
    initWeb3();
  }, []);

  const listProperty = async () => {
    try {
      await contract.methods.listProperty(description, web3.utils.toWei(value.toString(), 'ether'), ipfsHash).send({ from: account });
      console.log('Property listed successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="list-property-owner-container">
      <h1>REIT Management App</h1>
      <p>Account: {account}</p>
      <input className="input-field" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="input-field" type="number" placeholder="Value (ETH)" value={value} onChange={(e) => setValue(e.target.value)} />
      <input className="input-field" type="text" placeholder="IPFS Hash" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} />
      <br /><button className="button" onClick={listProperty}>List Property</button>
    </div>
  );
};

export default ListPropertyOwner;
