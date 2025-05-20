import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search, Bell, Settings, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ darkMode, setDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // تحديث الوقت والتاريخ
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // تنسيق الوقت بالعربية
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      setCurrentTime(now.toLocaleTimeString('ar-SA', timeOptions));
      
      // تنسيق التاريخ بالعربية
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('ar-SA', dateOptions));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // تحديث كل دقيقة
    
    return () => clearInterval(interval);
  }, []);

  // تتبع التمرير لتغيير مظهر الهيدر
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center transition-all duration-300 ${
          scrolled 
            ? darkMode 
              ? 'bg-neutral-900/90 backdrop-blur-sm shadow-elegant' 
              : 'bg-white/90 backdrop-blur-sm shadow-elegant' 
            : darkMode 
              ? 'bg-neutral-900' 
              : 'bg-gradient-to-r from-primary-600 to-primary-700'
        } ${darkMode ? 'text-white' : scrolled ? 'text-neutral-800' : 'text-white'}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <img 
              src="/logo.png" 
              alt="تذكير" 
              className="h-10 w-10 rounded-xl shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
              }}
            />
            <motion.div 
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${darkMode ? 'bg-accent-500' : 'bg-accent-400'}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold font-display">تذكير</h1>
            <p className="text-xs opacity-80 font-arabic hidden md:block">{currentDate}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
          <div className={`text-center px-3 py-1 rounded-lg ${darkMode ? 'bg-neutral-800' : scrolled ? 'bg-neutral-100' : 'bg-white/20'}`}>
            <p className="text-sm font-bold">{currentTime}</p>
          </div>
          
          <motion.button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`p-2 rounded-xl ${
              darkMode 
                ? 'bg-neutral-800 hover:bg-neutral-700' 
                : scrolled 
                  ? 'bg-neutral-100 hover:bg-neutral-200' 
                  : 'bg-white/20 hover:bg-white/30'
            } transition-colors duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          
          <motion.button 
            className={`p-2 rounded-xl ${
              darkMode 
                ? 'bg-neutral-800 hover:bg-neutral-700' 
                : scrolled 
                  ? 'bg-neutral-100 hover:bg-neutral-200' 
                  : 'bg-white/20 hover:bg-white/30'
            } transition-colors duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="البحث"
          >
            <Search size={20} />
          </motion.button>
          
          <motion.button 
            className={`p-2 rounded-xl ${
              darkMode 
                ? 'bg-neutral-800 hover:bg-neutral-700' 
                : scrolled 
                  ? 'bg-neutral-100 hover:bg-neutral-200' 
                  : 'bg-white/20 hover:bg-white/30'
            } transition-colors duration-200 relative`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="الإشعارات"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-accent-500"></span>
          </motion.button>
          
          <motion.button 
            className={`p-2 rounded-xl ${
              darkMode 
                ? 'bg-neutral-800 hover:bg-neutral-700' 
                : scrolled 
                  ? 'bg-neutral-100 hover:bg-neutral-200' 
                  : 'bg-white/20 hover:bg-white/30'
            } transition-colors duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="الإعدادات"
          >
            <Settings size={20} />
          </motion.button>
        </div>
        
        {/* زر القائمة للشاشات الصغيرة */}
        <div className="md:hidden">
          <motion.button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-xl ${
              darkMode 
                ? 'bg-neutral-800 hover:bg-neutral-700' 
                : scrolled 
                  ? 'bg-neutral-100 hover:bg-neutral-200' 
                  : 'bg-white/20 hover:bg-white/30'
            } transition-colors duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="القائمة"
          >
            <Menu size={20} />
          </motion.button>
        </div>
      </motion.header>
      
      {/* قائمة الشاشات الصغيرة */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            className={`fixed top-16 left-4 right-4 z-40 rounded-xl shadow-elegant p-4 ${
              darkMode ? 'bg-neutral-900' : 'bg-white'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm opacity-80">{currentDate}</p>
                <p className="text-sm font-bold">{currentTime}</p>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mt-2">
                <motion.button 
                  onClick={() => setDarkMode(!darkMode)} 
                  className={`p-3 rounded-xl flex flex-col items-center justify-center ${
                    darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span className="text-xs mt-1">{darkMode ? 'فاتح' : 'داكن'}</span>
                </motion.button>
                
                <motion.button 
                  className={`p-3 rounded-xl flex flex-col items-center justify-center ${
                    darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={20} />
                  <span className="text-xs mt-1">بحث</span>
                </motion.button>
                
                <motion.button 
                  className={`p-3 rounded-xl flex flex-col items-center justify-center ${
                    darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                  } relative`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500"></span>
                  <span className="text-xs mt-1">إشعارات</span>
                </motion.button>
                
                <motion.button 
                  className={`p-3 rounded-xl flex flex-col items-center justify-center ${
                    darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings size={20} />
                  <span className="text-xs mt-1">إعدادات</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* مساحة للهيدر الثابت */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;
