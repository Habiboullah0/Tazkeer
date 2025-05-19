import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Check, ChevronDown, ChevronUp } from 'lucide-react';

const LanguageSettingsScreen = ({ darkMode }) => {
  // State for language settings
  const [currentLanguage, setCurrentLanguage] = useState('ar');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  // Available languages
  const languages = [
    { code: 'ar', name: 'العربية', direction: 'rtl' },
    { code: 'en', name: 'English', direction: 'ltr' },
    { code: 'fr', name: 'Français', direction: 'ltr' },
    { code: 'ur', name: 'اردو', direction: 'rtl' },
    { code: 'id', name: 'Bahasa Indonesia', direction: 'ltr' },
    { code: 'tr', name: 'Türkçe', direction: 'ltr' }
  ];
  
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
  
  // Load language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
    }
  }, []);
  
  // Save language setting to local storage when it changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);
  
  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    setShowLanguageSelector(false);
  };
  
  // Get current language details
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold font-arabic">إعدادات اللغة</h2>
      </div>
      
      {/* Language Selector */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">اختر لغة التطبيق</h3>
        
        <div className="relative">
          <motion.button
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className={`w-full p-3 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
            } border-2 transition-colors duration-200 flex justify-between items-center`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <Globe size={18} className="ml-2 text-gray-500 dark:text-gray-400" />
              <span>{getCurrentLanguage().name}</span>
            </div>
            {showLanguageSelector ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.button>
          
          {showLanguageSelector && (
            <motion.div 
              className={`absolute z-10 mt-1 w-full rounded-lg ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              } border shadow-lg`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ul className="py-1">
                {languages.map(language => (
                  <li key={language.code}>
                    <motion.button
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full px-4 py-2 text-right ${
                        language.code === currentLanguage
                          ? (darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-900')
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                      } flex justify-between items-center`}
                      whileHover={{ backgroundColor: darkMode ? '#374151' : '#F3F4F6' }}
                      dir={language.direction}
                    >
                      <span>{language.name}</span>
                      {language.code === currentLanguage && <Check size={16} />}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Language Features */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">ميزات اللغة</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-arabic">واجهة المستخدم</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
            }`}>متوفر</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">ترجمة القرآن</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
            }`}>متوفر</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">ترجمة الأحاديث</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
            }`}>جزئي</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">الأذكار والأدعية</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
            }`}>متوفر</span>
          </div>
        </div>
      </motion.div>
      
      {/* Translation Settings */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">إعدادات الترجمة</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium font-arabic">ترجمة القرآن</label>
            <select
              className={`w-full p-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-primary-500' 
                  : 'bg-gray-100 border-gray-200 focus:border-primary-500'
              } border-2 focus:outline-none transition-colors duration-200`}
            >
              <option value="hilali">محمد تقي الدين الهلالي</option>
              <option value="sahih">صحيح انترناشونال</option>
              <option value="pickthall">محمد مارمادوك بيكثال</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium font-arabic">ترجمة الأحاديث</label>
            <select
              className={`w-full p-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-primary-500' 
                  : 'bg-gray-100 border-gray-200 focus:border-primary-500'
              } border-2 focus:outline-none transition-colors duration-200`}
            >
              <option value="default">الترجمة الافتراضية</option>
              <option value="alternative">ترجمة بديلة</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Language Tips */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-3 font-arabic">نصائح اللغة</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li className="font-arabic">يمكنك تغيير لغة التطبيق في أي وقت</li>
          <li className="font-arabic">تتوفر ترجمات متعددة للقرآن الكريم</li>
          <li className="font-arabic">بعض اللغات قد لا تدعم جميع الميزات</li>
          <li className="font-arabic">يتم تحديث الترجمات بشكل دوري</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default LanguageSettingsScreen;
