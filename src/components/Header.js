import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <motion.header 
      className={`p-4 flex justify-between items-center ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-primary-600 text-white'
      } shadow-lg`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img 
            src="/logo.png" 
            alt="تذكير" 
            className="h-8 w-8 rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
            }}
          />
        </motion.div>
        <h1 className="text-2xl font-bold font-arabic">تذكير</h1>
      </div>
      <div className="flex space-x-2">
        <motion.button 
          onClick={() => setDarkMode(!darkMode)} 
          className={`p-2 rounded-full ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-primary-700 hover:bg-primary-800'
          } transition-colors duration-200`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
