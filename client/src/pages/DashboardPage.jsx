import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { walletAPI } from '../services/api';

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const response = await walletAPI.getWallet();
      setWallet(response.data.wallet);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container text-center py-20">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container pb-20"
    >
      <h2 className="text-2xl font-bold mb-6 mt-6">Dashboard</h2>

      {/* Total Balance Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white"
      >
        <p className="text-sm opacity-90">Total Balance</p>
        <h3 className="text-4xl font-bold my-2">₦{wallet?.totalBalance?.toLocaleString()}</h3>
        <p className="text-xs opacity-75">Last updated: just now</p>
      </motion.div>

      {/* Balance Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div whileHover={{ scale: 1.05 }} className="card">
          <p className="text-xs text-gray-500">Main Balance</p>
          <p className="text-xl font-bold">₦{wallet?.mainBalance?.toLocaleString()}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="card">
          <p className="text-xs text-gray-500">Investment</p>
          <p className="text-xl font-bold">₦{wallet?.investmentBalance?.toLocaleString()}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="card">
          <p className="text-xs text-gray-500">Referral Earnings</p>
          <p className="text-xl font-bold">₦{wallet?.referralBalance?.toLocaleString()}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="card">
          <p className="text-xs text-gray-500">Task Rewards</p>
          <p className="text-xl font-bold">₦{wallet?.taskBalance?.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <motion.button whileHover={{ scale: 1.05 }} className="btn bg-green-500 hover:bg-green-600">
            💳 Deposit
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} className="btn bg-blue-500 hover:bg-blue-600">
            💰 Invest
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} className="btn bg-purple-500 hover:bg-purple-600">
            📈 Withdraw
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} className="btn bg-orange-500 hover:bg-orange-600">
            ✅ Tasks
          </motion.button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Recent Activity</h4>
        <div className="card">
          <p className="text-center text-gray-500">No recent activity</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
