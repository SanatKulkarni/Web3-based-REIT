import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import REITManagementABI from '../../constants/REITManagementABI.json';

const contractAddress = "0x26375DdD53bC9a61d765172BF53A27D689657b40";  // Replace with your actual contract address

const REITManagementComponent = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [propertyId, setPropertyId] = useState('');

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable(); // Request account access if needed
                    const acc = await web3Instance.eth.getAccounts();
                    setWeb3(web3Instance);
                    setAccounts(acc);
                    const contractInstance = new web3Instance.eth.Contract(REITManagementABI, contractAddress);
                    setContract(contractInstance);
                } catch (error) {
                    console.error("Error initializing web3", error);
                }
            } else {
                console.error("MetaMask is not installed!");
                alert("Please install MetaMask!");
            }
        };

        initWeb3();
    }, []);

    const handleInvest = async () => {
        if (contract && propertyId && investmentAmount) {
            try {
                const response = await contract.methods.investIntoProperty(propertyId, investmentAmount).send({ from: accounts[0] });
                console.log('Investment transaction:', response);
                alert('Investment successful!');
            } catch (error) {
                console.error('Error making investment:', error);
                alert('Investment failed!');
            }
        } else {
            alert('Please fill all fields!');
        }
    };

    return (
        <div>
            <h1>Invest into Property</h1>
            <input type="number" placeholder="Property ID" value={propertyId} onChange={e => setPropertyId(e.target.value)} />
            <input type="text" placeholder="Investment Amount in Wei" value={investmentAmount} onChange={e => setInvestmentAmount(e.target.value)} />
            <button onClick={handleInvest}>Invest</button>
        </div>
    );
};

export default REITManagementComponent;
