import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import REITManagementABI from '../../constants/REITManagementABI.json';
import './REITManagementApp.css';

const REITManagementAddress = '0x26375DdD53bC9a61d765172BF53A27D689657b40';

const REITManagementApp = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [rent, setRent] = useState('');
  const [distributionAmount, setDistributionAmount] = useState(''); // New state for distribution amount
  const [taxRate, setTaxRate] = useState('');
  const [stakeholderAddress, setStakeholderAddress] = useState('');
  const [tenant, setTenant] = useState('');
  const [tenantDuration, setTenantDuration] = useState('');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        const contractInstance = new web3Instance.eth.Contract(REITManagementABI, REITManagementAddress);
        setWeb3(web3Instance);
        setContract(contractInstance);
        setAccounts(accounts);
        loadProperties(contractInstance);
      } else {
        alert('Please install MetaMask to use this application.');
      }
    };

    initWeb3();
  }, []);

  const loadProperties = async (contractInstance) => {
    const count = await contractInstance.methods.getPropertyCount().call();
    const propertiesArray = [];
    for (let i = 1; i <= count; i++) {
      const property = await contractInstance.methods.getPropertyDetails(i).call();
      propertiesArray.push({ id: i.toString(), ...property });
    }
    setProperties(propertiesArray);
  };

  const handlePropertySelect = (e) => {
    setSelectedPropertyId(e.target.value);
  };

  const handleSetRent = async () => {
    if (!selectedPropertyId) {
      alert('Please select a property first.');
      return;
    }
    await contract.methods.setRent(selectedPropertyId, web3.utils.toWei(rent, 'ether')).send({ from: accounts[0] });
    alert('Rent updated successfully!');
  };

  const handleSetTaxRate = async () => {
    await contract.methods.setTaxRate(web3.utils.toWei(taxRate, 'ether')).send({ from: accounts[0] });
    alert('Tax rate updated successfully!');
  };

  const handleAddStakeholder = async () => {
    await contract.methods.addStakeholder(stakeholderAddress).send({ from: accounts[0] });
    alert('Stakeholder added successfully!');
  };

  const handleBanStakeholder = async () => {
    await contract.methods.banStakeholder(stakeholderAddress).send({ from: accounts[0] });
    alert('Stakeholder banned successfully!');
  };

  const handleAddTenant = async () => {
    if (!selectedPropertyId) {
      alert('Please select a property first.');
      return;
    }
    await contract.methods.addTenant(selectedPropertyId, tenant, parseInt(tenantDuration)).send({ from: accounts[0] });
    alert('Tenant added successfully!');
  };

  const handleDistributeRent = async () => {
    if (!selectedPropertyId) {
      alert('Please select a property first.');
      return;
    }
    await contract.methods.distributeRent(selectedPropertyId, web3.utils.toWei(distributionAmount, 'ether')).send({ from: accounts[0] });
    alert('Rent distributed successfully!');
  };

  return (
    <div>
      <h1>REIT Management App</h1>
      <select onChange={handlePropertySelect} value={selectedPropertyId || ""}>
        <option value="">Select Property</option>
        {properties.map((prop, index) => (
          <option key={index} value={prop.id}>{prop.description}</option>
        ))}
      </select>

      {selectedPropertyId && (
        <>
          <div>
            <input type="text" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="Set Rent (ETH)" />
            <button onClick={handleSetRent}>Set Rent</button>
          </div>
          <div>
            <input type="text" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="Set Tax Rate" />
            <button onClick={handleSetTaxRate}>Set Tax Rate</button>
          </div>
          <div>
            <input type="text" value={stakeholderAddress} onChange={(e) => setStakeholderAddress(e.target.value)} placeholder="Stakeholder Address" />
            <button onClick={handleAddStakeholder}>Add Stakeholder</button>
            <button onClick={handleBanStakeholder}>Ban Stakeholder</button>
          </div>
          <div>
            <input type="text" value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="Tenant Address" />
            <input type="number" value={tenantDuration} onChange={(e) => setTenantDuration(e.target.value)} placeholder="Duration (months)" />
            <button onClick={handleAddTenant}>Add Tenant</button>
          </div>
          <div>
            <input type="text" value={distributionAmount} onChange={(e) => setDistributionAmount(e.target.value)} placeholder="Distribution Amount (ETH)" />
            <button onClick={handleDistributeRent}>Distribute Rent</button>
          </div>
        </>
      )}
    </div>
  );
};

export default REITManagementApp;
