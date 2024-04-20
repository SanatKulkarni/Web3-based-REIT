import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ConnectWallet from './components/ConnectWallet.jsx'; // Import the ConnectWallet component
import ListPropertyOwner from './pages/ListPropertyOwner.jsx';
import Dashboard from './pages/Dashboard.jsx';
import REITManagementApp from './pages/REITManagementApp.jsx';
import PropertyInvestment from './pages/PropertyInvestment.jsx';
import PayRentApp from './pages/PayRentApp.jsx'; // Import the PayRentApp component

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/list-property-owner">List Property Owner</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/reit-management-app">REIT Management App</Link>
            </li>
            <li>
              <Link to="/property-investment">Property Investment</Link>
            </li>
            <li>
              <Link to="/pay-rent">Pay Rent</Link> {/* Add the Link to Pay Rent */}
            </li>
            <li className='connect-wallet-btn'>
              <ConnectWallet /> {/* Include the ConnectWallet component */}
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/list-property-owner" element={<ListPropertyOwner />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reit-management-app" element={<REITManagementApp />} />
          <Route path="/property-investment" element={<PropertyInvestment />} />
          <Route path="/pay-rent" element={<PayRentApp />} /> {/* Add the Route for Pay Rent */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
