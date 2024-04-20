import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import REITManagementABI from '../../constants/REITManagementABI.json'; // Import the compiled contract ABI

const REITManagementAddress = '0x26375DdD53bC9a61d765172BF53A27D689657b40'; // Address of your deployed contract

const Dashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [propertyCount, setPropertyCount] = useState(0);
  const [properties, setProperties] = useState([]);
  const [tenantStatuses, setTenantStatuses] = useState({}); // Store tenant rent statuses for each property
  const [ipfsGateway, setIpfsGateway] = useState('https://ipfs.io'); // Set the IPFS gateway URL

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

  useEffect(() => {
    const fetchPropertyCount = async () => {
      if (contract) {
        const count = await contract.methods.getPropertyCount().call();
        setPropertyCount(parseInt(count));
      }
    };
    fetchPropertyCount();
  }, [contract]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (contract && propertyCount > 0) {
        const propertyList = [];
        for (let i = 1; i <= propertyCount; i++) {
          const propertyDetails = await contract.methods.getPropertyDetails(i).call();
          const valueInEth = web3.utils.fromWei(propertyDetails.propertyValue.toString(), 'ether');
          propertyDetails.propertyValue = valueInEth;
          propertyList.push(propertyDetails);
        }
        setProperties(propertyList);
      }
    };
    fetchProperties();
  }, [contract, propertyCount, web3]);

  useEffect(() => {
    const fetchTenantStatuses = async () => {
      if (contract && propertyCount > 0) {
        const statuses = {};
        for (let i = 1; i <= propertyCount; i++) {
          const status = await contract.methods.getTenantStatus(i).call();
          statuses[i] = status;
        }
        setTenantStatuses(statuses);
      }
    };
    fetchTenantStatuses();
  }, [contract, propertyCount]);

  const handlePropertyClick = async (propertyId) => {
    // This function can be used to handle property click events if needed
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Connected Account: {account}</p>
      <h2>Properties</h2>
      <ul>
        {properties.map((property, index) => (
          <li key={index} onClick={() => handlePropertyClick(index + 1)}>
            <p>Description: {property.description}</p>
            <p>Value: {property.propertyValue} ETH</p>
            {
              property.ipfsHash &&
              <img src={`${ipfsGateway}/ipfs/${property.ipfsHash}`} alt="Property" style={{ maxWidth: '200px' }} />
            }
            {tenantStatuses[property.id] !== undefined && ( // Check if tenant status is available
              <p>Tenant Rent Status: {tenantStatuses[property.id] ? 'Paid' : 'Unpaid'}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
