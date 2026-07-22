import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Header = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sticky top-0"
      style={{ zIndex: 100 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🚀</div>
          <div>
            <h1 className="text-xl font-bold">NovaVest</h1>
            <p className="text-xs text-blue-100">Investment Platform</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{user?.firstName || 'User'}</p>
          <p className="text-xs text-blue-100">Online</p>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
