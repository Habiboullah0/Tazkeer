import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, BellRing, Zap, BookOpen, Moon, Sun } from 'lucide-react';
import { usePrayerTimes } from '../hooks/useAPI';

const SettingsScreen = ({ 
  darkMode, 
  updateSetting 
}) => {
  // State for settings
  const [settings, setSettings] = useState({
    notificationSound: true,
    vibration: true,
    quranEnabled: true,
    hadithEnabled: true,
    prayerReminders: true,
    frequency: "medium",
    favoriteCategories: ["أذكار الصباح", "أذكار المساء", "فضل الذكر"]
  });
  
  // Get prayer times API to check if it's working
  const { prayerTimes, error: prayerTimesError } = usePrayerTimes();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Load settings from local storage
  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);
  
  // Save settings to local storage when they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);
  
  // Handle setting updates
  const handleUpdateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    updateSetting(key, value);
  };

  // Toggle switch component
  const ToggleSwitch = ({ enabled, onChange, label, icon: Icon }) => (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {Icon && <Icon size={18} className="ml-2 text-gray-500 dark:text-gray-400" />}
        <label className="font-arabic">{label}</label>
      </div>
      <motion.div 
        onClick={onChange}
        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${
          enabled 
            ? (darkMode ? 'bg-primary-600' : 'bg-primary-500') 
            : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className={`w-4 h-4 rounded-full bg-white`}
          animate={{ 
            x: enabled ? 24 : 0 
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </div>
  );

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2 className="text-xl font-bold mb-4 font-arabic">الإعدادات</h2>
      
      {/* API Status */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">حالة الاتصال</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-arabic">القرآن الكريم API</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
            }`}>متصل</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">الأحاديث النبوية API</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
            }`}>متصل</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">مواقيت الصلاة API</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              prayerTimesError 
                ? (darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800')
                : (darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800')
            }`}>{prayerTimesError ? 'غير متصل' : 'متصل'}</span>
          </div>
        </div>
      </motion.div>
      
      {/* Notification Settings */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">إعدادات الإشعارات</h3>
        
        <div className="space-y-4">
          <ToggleSwitch 
            enabled={settings.notificationSound} 
            onChange={() => handleUpdateSetting('notificationSound', !settings.notificationSound)}
            label="صوت الإشعارات"
            icon={Volume2}
          />
          
          <ToggleSwitch 
            enabled={settings.vibration} 
            onChange={() => handleUpdateSetting('vibration', !settings.vibration)}
            label="الاهتزاز"
            icon={Zap}
          />
        </div>
      </motion.div>
      
      {/* Content Settings */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">إعدادات المحتوى</h3>
        
        <div className="space-y-4">
          <ToggleSwitch 
            enabled={settings.quranEnabled} 
            onChange={() => handleUpdateSetting('quranEnabled', !settings.quranEnabled)}
            label="تفعيل آيات القرآن"
            icon={BookOpen}
          />
          
          <ToggleSwitch 
            enabled={settings.hadithEnabled} 
            onChange={() => handleUpdateSetting('hadithEnabled', !settings.hadithEnabled)}
            label="تفعيل الأحاديث"
            icon={BookOpen}
          />
          
          <ToggleSwitch 
            enabled={settings.prayerReminders} 
            onChange={() => handleUpdateSetting('prayerReminders', !settings.prayerReminders)}
            label="تذكير بمواقيت الصلاة"
            icon={BellRing}
          />
        </div>
      </motion.div>
      
      {/* Notification Frequency */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">تواتر الإشعارات</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="low" 
              name="frequency" 
              checked={settings.frequency === "low"} 
              onChange={() => handleUpdateSetting('frequency', 'low')}
              className={`ml-2 w-4 h-4 text-primary-600 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
            />
            <label htmlFor="low" className="font-arabic">منخفض (1-2 يوميًا)</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="medium" 
              name="frequency" 
              checked={settings.frequency === "medium"} 
              onChange={() => handleUpdateSetting('frequency', 'medium')}
              className={`ml-2 w-4 h-4 text-primary-600 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
            />
            <label htmlFor="medium" className="font-arabic">متوسط (3-5 يوميًا)</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="high" 
              name="frequency" 
              checked={settings.frequency === "high"} 
              onChange={() => handleUpdateSetting('frequency', 'high')}
              className={`ml-2 w-4 h-4 text-primary-600 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
            />
            <label htmlFor="high" className="font-arabic">مرتفع (6-10 يوميًا)</label>
          </div>
        </div>
      </motion.div>
      
      {/* Favorite Categories */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">الفئات المفضلة</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="morning" 
              checked={settings.favoriteCategories.includes("أذكار الصباح")} 
              onChange={(e) => {
                if (e.target.checked) {
                  handleUpdateSetting('favoriteCategories', [...settings.favoriteCategories, "أذكار الصباح"]);
                } else {
                  handleUpdateSetting('favoriteCategories', settings.favoriteCategories.filter(cat => cat !== "أذكار الصباح"));
                }
              }}
              className={`ml-2 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
            />
            <label htmlFor="morning" className="font-arabic">أذكار الصباح</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="evening" 
              checked={settings.favoriteCategories.includes("أذكار المساء")} 
              onChange={(e) => {
                if (e.target.checked) {
                  handleUpdateSetting('favoriteCategories', [...settings.favoriteCategories, "أذكار المساء"]);
                } else {
                  handleUpdateSetting('favoriteCategories', settings.favoriteCategories.filter(cat => cat !== "أذكار المساء"));
                }
              }}
              className={`ml-2 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
            />
            <label htmlFor="evening" className="font-arabic">أذكار المساء</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="virtue" 
              checked={settings.favoriteCategories.includes("فضل الذكر")} 
              onChange={(e) => {
                if (e.target.checked) {
                  handleUpdateSetting('favoriteCategories', [...settings.favoriteCategories, "فضل الذكر"]);
                } else {
                  handleUpdateSetting('favoriteCategories', settings.favoriteCategories.filter(cat => cat !== "فضل الذكر"));
                }
              }}
              className={`ml-2 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
            />
            <label htmlFor="virtue" className="font-arabic">فضل الذكر</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="prayers" 
              checked={settings.favoriteCategories.includes("أدعية مأثورة")} 
              onChange={(e) => {
                if (e.target.checked) {
                  handleUpdateSetting('favoriteCategories', [...settings.favoriteCategories, "أدعية مأثورة"]);
                } else {
                  handleUpdateSetting('favoriteCategories', settings.favoriteCategories.filter(cat => cat !== "أدعية مأثورة"));
                }
              }}
              className={`ml-2 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
            />
            <label htmlFor="prayers" className="font-arabic">أدعية مأثورة</label>
          </div>
        </div>
      </motion.div>
      
      {/* App Information */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">معلومات التطبيق</h3>
        
        <div className="space-y-3">
          <p className="font-arabic">إصدار التطبيق: <span className="font-bold">2.0.0</span></p>
          <p className="font-arabic">تطوير: <span className="font-bold">فريق تذكير</span></p>
          
          <div className="flex space-x-2 mt-4">
            <motion.button 
              className={`px-4 py-2 rounded-lg ${
                darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors duration-200 font-arabic`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              تقييم التطبيق
            </motion.button>
            
            <motion.button 
              className={`px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-200 font-arabic`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              مشاركة التطبيق
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Theme Toggle */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">المظهر</h3>
        
        <div className="flex justify-between">
          <div className="flex items-center">
            {darkMode ? (
              <Moon size={20} className="ml-2 text-gray-400" />
            ) : (
              <Sun size={20} className="ml-2 text-yellow-500" />
            )}
            <span className="font-arabic">{darkMode ? 'الوضع الداكن' : 'الوضع الفاتح'}</span>
          </div>
          
          <motion.button 
            className={`px-4 py-1 rounded-full text-sm ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } transition-colors duration-200 font-arabic`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Toggle dark mode functionality would go here
              // This is a placeholder for now
              alert('سيتم تنفيذ هذه الميزة في الإصدار القادم');
            }}
          >
            تغيير
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsScreen;
