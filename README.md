# REIT Management DApp

A decentralized application (DApp) built on Ethereum that enables **Real Estate Investment Trust (REIT)** management using smart contracts.
This system allows property listing, fractional investment, tenant management, rent payment tracking, and rent distribution to investors.
The project includes a **Solidity smart contract** and a **React-based frontend UI**.

---

## Features

### **Property Management**

* Stakeholders can list properties with description, value, and IPFS images.
* Owners can set rent and manage tenants.

### **Investment System**

* Users can invest up to **50%** of a property’s value.
* Tracks total investment per property.
* Investors earn proportional rent distribution.

### **Tenant Management**

* Add tenants with defined rental duration.
* Track monthly rent payments.
* Check tenant payment status.

### **Rent Distribution**

* Property owners can distribute rent to all investors.
* Distribution is proportional to their investment share.

### **Stakeholder Controls**

* Admin can add or ban stakeholders.
* Only stakeholders can list properties.

---

## Tech Stack

### **Smart Contract**

* Solidity ^0.8.0
* Events for real-time updates
* IPFS support for property images
* Tenant and investor mapping structures

### **Frontend**

* React
* Web3 / Ethers.js
* IPFS integration
* Wallet connection UI (MetaMask)

---

## Smart Contract Structure

### **Key Structs**

* `Property`: Stores owner, IPFS hash, value, rent, investments, and investors list.
* `Tenant`: Stores rental duration and monthly payment status.

### **Core Functions**

* `listProperty()`
* `setRent()`
* `addTenant()`
* `payRent()`
* `investIntoProperty()`
* `distributeRent()`
* `getPropertyDetails()`
* `getTenantStatus()`

---

## How to Run the Project

### **1. Install dependencies**

```bash
npm install
```

### **2. Start local blockchain (Hardhat / Ganache)**

```bash
npx hardhat node
```

### **3. Deploy the contract**

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### **4. Start React frontend**

```bash
npm start
```

---

## Interaction Flow

1. **Admin adds stakeholders**
2. **Stakeholder lists property**
3. **Investors invest**
4. **Owner adds tenants & sets rent**
5. **Tenants pay rent**
6. **Owner distributes rent among investors**

---

## 📁 Project Structure

```
/contracts
    REITManagement.sol
/src
    components/
    pages/
    utils/
    App.js
/scripts
    deploy.js
```
