import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WalletPage from './pages/WalletPage';
import InvestmentPage from './pages/InvestmentPage';
import DepositPage from './pages/DepositPage';
import WithdrawalPage from './pages/WithdrawalPage';
import ReferralPage from './pages/ReferralPage';
import TaskPage from './pages/TaskPage';
import SettingsPage from './pages/SettingsPage';

// Components
import BottomNav from './components/BottomNav';
import Header from './components/Header';

// Styles
import './styles/global.css';

// Redux
import { initializeApp } from './store/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated && <Header />}
      <div style={{ paddingBottom: isAuthenticated ? '80px' : '0' }}>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/investment" element={<InvestmentPage />} />
              <Route path="/deposit" element={<DepositPage />} />
              <Route path="/withdrawal" element={<WithdrawalPage />} />
              <Route path="/referral" element={<ReferralPage />} />
              <Route path="/task" element={<TaskPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
      {isAuthenticated && <BottomNav />}
    </Router>
  );
}

export default App;
