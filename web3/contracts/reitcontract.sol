// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract REITManagement {
    address public owner;
    uint public propertyCount = 0;
    uint public taxRate = 5; // Tax rate in percentage

    struct Property {
        address payable propertyOwner;
        string description;
        uint propertyValue;
        uint totalInvested;
        uint rent;
        string ipfsHash; // Reference to property image stored on IPFS
        mapping(address => uint) investments;
        mapping(address => Tenant) tenants;
        address[] investors; // Array to keep track of investors
    }

    struct Tenant {
        uint duration; // in months
        mapping(uint => bool) rentPaid; // month number to payment status
    }

    mapping(uint => Property) public properties;
    mapping(address => bool) public stakeholders;

    event PropertyListed(uint propertyId, address owner, uint value, string ipfsHash);
    event Invested(uint propertyId, address investor, uint amount);
    event RentSet(uint propertyId, uint rent);
    event RentPaid(uint propertyId, address tenant, uint amount, uint month);
    event TenantAdded(uint propertyId, address tenant, uint duration);
    event StakeholderAdded(address stakeholder);
    event StakeholderBanned(address stakeholder);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyPropertyOwner(uint propertyId) {
        require(properties[propertyId].propertyOwner == msg.sender, "Not the property owner");
        _;
    }

    modifier onlyStakeholder() {
        require(stakeholders[msg.sender], "Only stakeholders can perform this action");
        _;
    }

    function setTaxRate(uint _taxRate) public onlyOwner {
        taxRate = _taxRate;
    }

    function addStakeholder(address _stakeholder) public onlyOwner {
        stakeholders[_stakeholder] = true;
        emit StakeholderAdded(_stakeholder);
    }

    function banStakeholder(address _stakeholder) public onlyOwner {
        stakeholders[_stakeholder] = false;
        emit StakeholderBanned(_stakeholder);
    }

    function listProperty(string memory _description, uint _value, string memory _ipfsHash) public onlyStakeholder {
        propertyCount += 1;
        Property storage p = properties[propertyCount];
        p.propertyOwner = payable(msg.sender);
        p.description = _description;
        p.propertyValue = _value;
        p.ipfsHash = _ipfsHash; // Store IPFS hash of property image

        emit PropertyListed(propertyCount, msg.sender, _value, _ipfsHash);
    }

    function setRent(uint _propertyId, uint _rent) public onlyPropertyOwner(_propertyId) {
        Property storage p = properties[_propertyId];
        p.rent = _rent;
        emit RentSet(_propertyId, _rent);
    }

    function addTenant(uint _propertyId, address _tenant, uint _duration) public onlyPropertyOwner(_propertyId) {
        Property storage p = properties[_propertyId];
        Tenant storage t = p.tenants[_tenant];
        t.duration = _duration;
        for (uint i = 1; i <= _duration; i++) {
            t.rentPaid[i] = false;
        }
        emit TenantAdded(_propertyId, _tenant, _duration);
    }

    function payRent(uint _propertyId, uint _month, uint _amount) public {
        Property storage p = properties[_propertyId];
        require(p.tenants[msg.sender].duration >= _month, "Rent duration exceeded");
        require(_amount > 0, "Rent amount must be greater than 0");

        p.tenants[msg.sender].rentPaid[_month] = true;
        emit RentPaid(_propertyId, msg.sender, _amount, _month);
    }

    function isRentPaid(uint _propertyId, address _tenant, uint _month) public view returns (bool) {
        Property storage p = properties[_propertyId];
        return p.tenants[_tenant].rentPaid[_month];
    }

    // Profile dashboard functions

    function getPropertyCount() public view returns (uint) {
        return propertyCount;
    }

    function getPropertyDetails(uint _propertyId) public view returns (
        address propertyOwner,
        string memory description,
        uint propertyValue,
        uint totalInvested,
        uint rent,
        string memory ipfsHash
    ) {
        Property storage p = properties[_propertyId];
        return (
            p.propertyOwner,
            p.description,
            p.propertyValue,
            p.totalInvested,
            p.rent,
            p.ipfsHash
        );
    }

    function getInvestedProperties(address _investor) public view returns (PropertyDetail[] memory) {
        uint[] memory investedPropertyIds = new uint[](propertyCount);
        uint counter = 0;
        for (uint i = 1; i <= propertyCount; i++) {
            if (properties[i].investments[_investor] > 0) {
                investedPropertyIds[counter] = i;
                counter++;
            }
        }

        PropertyDetail[] memory investedProperties = new PropertyDetail[](counter);
        for (uint j = 0; j < counter; j++) {
            uint propertyId = investedPropertyIds[j];
            Property storage prop = properties[propertyId];
            investedProperties[j] = PropertyDetail({
                id: propertyId,
                description: prop.description,
                value: prop.propertyValue,
                ipfsHash: prop.ipfsHash
            });
        }
        return investedProperties;
    }

    function investIntoProperty(uint _propertyId, uint _investmentAmount) public {
        Property storage p = properties[_propertyId];
        require(_investmentAmount > 0, "Investment amount must be greater than 0");
        require(_investmentAmount <= (p.propertyValue * 50) / 100, "Investment exceeds 50% of property value");

        p.totalInvested += _investmentAmount;
        p.investments[msg.sender] += _investmentAmount;
        p.investors.push(msg.sender); // Add investor to the investors array

        emit Invested(_propertyId, msg.sender, _investmentAmount);
    }

    function distributeRent(uint _propertyId, uint _amount) public {
        Property storage p = properties[_propertyId];
        require(p.totalInvested > 0, "No investments made for this property");
        require(_amount <= address(this).balance, "Insufficient balance to distribute");

        uint totalRentShare = 0;
        for (uint i = 0; i < p.investors.length; i++) {
            address investor = p.investors[i];
            uint investorShare = p.investments[investor];
            uint rentShare = (_amount * investorShare) / p.totalInvested;
            totalRentShare += rentShare;
        }
        require(_amount >= totalRentShare, "Rent distribution exceeds the amount");

        for (uint i = 0; i < p.investors.length; i++) {
            address investor = p.investors[i];
            uint investorShare = p.investments[investor];
            uint rentShare = (_amount * investorShare) / p.totalInvested;
            payable(investor).transfer(rentShare);
        }
    }

    function getTenantStatus(uint _propertyId, address _tenant) public view returns (bool[] memory) {
        Tenant storage tenant = properties[_propertyId].tenants[_tenant];
        bool[] memory rentStatus = new bool[](tenant.duration);
        for (uint i = 0; i < tenant.duration; i++) {
            rentStatus[i] = tenant.rentPaid[i + 1];
        }
        return rentStatus;
    }

    struct PropertyDetail {
        uint id;
        string description;
        uint value;
        string ipfsHash;
    }
}
