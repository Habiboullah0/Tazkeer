import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, MessageSquare } from 'lucide-react';
import { useQuranVerse, useHadith, usePrayerTimes } from '../hooks/useAPI';

const HomeScreen = ({ 
  isItemFavorite, 
  toggleFavorite, 
  shareContent, 
  darkMode 
}) => {
  // استخدام الـ hooks للحصول على البيانات من API
  const { verse, loading: loadingQuran, error: quranError, fetchRandomVerse } = useQuranVerse();
  const { hadith, loading: loadingHadith, error: hadithError, fetchRandomHadith } = useHadith();
  const { prayerTimes, loading: loadingPrayerTimes, error: prayerTimesError } = usePrayerTimes();
  
  // حالة للإشعارات
  const [notifications, setNotifications] = useState([]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
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
      transition: { duration: 0.5 }
    }
  };

  // محاكاة استلام إشعارات جديدة
  useEffect(() => {
    const interval = setInterval(() => {
      if (verse && hadith) {
        const types = ['quran', 'hadith'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        let newNotification = {
          id: Date.now(),
          type: randomType,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        
        if (randomType === 'quran') {
          newNotification.content = verse.text;
          newNotification.source = `سورة ${verse.surah} - آية ${verse.ayah}`;
        } else {
          newNotification.content = hadith.text;
          newNotification.source = `رواه ${hadith.narrator}`;
        }
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [verse, hadith]);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className={`animate-pulse p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`h-5 w-1/3 mb-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className={`h-20 w-full mb-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className="flex justify-between items-center">
        <div className={`h-4 w-1/4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        <div className="flex space-x-2">
          <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900' : 'bg-red-100'} ${darkMode ? 'text-red-200' : 'text-red-800'} mb-4`}>
      <p className="font-arabic">{message}</p>
      <button 
        className={`mt-2 px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-red-800 hover:bg-red-700' : 'bg-red-200 hover:bg-red-300'}`}
        onClick={() => window.location.reload()}
      >
        إعادة المحاولة
      </button>
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
      {/* Current Quran Verse Section */}
      <motion.div variants={itemVariants}>
        {quranError && <ErrorMessage message={quranError} />}
        
        {loadingQuran ? (
          <SkeletonLoader />
        ) : (
          <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r-4 border-primary-500`}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400 font-arabic">آية اليوم</h2>
              <motion.button 
                onClick={fetchRandomVerse}
                className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                آية أخرى
              </motion.button>
            </div>
            
            {verse && (
              <>
                <p className="text-lg mb-4 leading-relaxed font-arabic">{verse.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">سورة {verse.surah} - آية {verse.ayah}</span>
                  <div className="flex space-x-2">
                    <motion.button 
                      onClick={() => toggleFavorite(verse, 'quran')} 
                      className={`p-2 rounded-full ${isItemFavorite(verse, 'quran') ? 'text-red-500' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={isItemFavorite(verse, 'quran') ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    >
                      <Heart size={20} fill={isItemFavorite(verse, 'quran') ? "currentColor" : "none"} />
                    </motion.button>
                    <motion.button 
                      onClick={() => shareContent(verse.text, `سورة ${verse.surah} - آية ${verse.ayah}`)} 
                      className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="مشاركة"
                    >
                      <Share2 size={20} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Current Hadith Section */}
      <motion.div variants={itemVariants}>
        {hadithError && <ErrorMessage message={hadithError} />}
        
        {loadingHadith ? (
          <SkeletonLoader />
        ) : (
          <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r-4 border-secondary-500`}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold mb-3 text-secondary-600 dark:text-secondary-400 font-arabic">حديث اليوم</h2>
              <motion.button 
                onClick={fetchRandomHadith}
                className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                حديث آخر
              </motion.button>
            </div>
            
            {hadith && (
              <>
                <p className="text-lg mb-4 leading-relaxed font-arabic">{hadith.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">رواه {hadith.narrator}</span>
                  <div className="flex space-x-2">
                    <motion.button 
                      onClick={() => toggleFavorite(hadith, 'hadith')} 
                      className={`p-2 rounded-full ${isItemFavorite(hadith, 'hadith') ? 'text-red-500' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={isItemFavorite(hadith, 'hadith') ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    >
                      <Heart size={20} fill={isItemFavorite(hadith, 'hadith') ? "currentColor" : "none"} />
                    </motion.button>
                    <motion.button 
                      onClick={() => shareContent(hadith.text, `رواه ${hadith.narrator}`)} 
                      className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="مشاركة"
                    >
                      <Share2 size={20} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Prayer Times Section */}
      <motion.div variants={itemVariants}>
        {prayerTimesError && <ErrorMessage message={prayerTimesError} />}
        
        {loadingPrayerTimes ? (
          <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4 font-arabic">مواقيت الصلاة</h2>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="text-center animate-pulse">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-1`}>
                    <div className={`h-5 w-16 mx-auto mb-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                    <div className={`h-4 w-12 mx-auto rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4 font-arabic">مواقيت الصلاة</h2>
            {prayerTimes && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-100 hover:bg-green-200'} mb-1 transition-colors duration-200 cursor-pointer`}>
                    <p className="font-bold font-arabic">الفجر</p>
                    <p dir="ltr">{prayerTimes.fajr}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-yellow-100 hover:bg-yellow-200'} mb-1 transition-colors duration-200 cursor-pointer`}>
                    <p className="font-bold font-arabic">الشروق</p>
                    <p dir="ltr">{prayerTimes.sunrise}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'} mb-1 transition-colors duration-200 cursor-pointer`}>
                    <p className="font-bold font-arabic">الظهر</p>
                    <p dir="ltr">{prayerTimes.dhuhr}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-100 hover:bg-indigo-200'} mb-1 transition-colors duration-200 cursor-pointer`}>
                    <p className="font-bold font-arabic">العصر</p>
                    <p dir="ltr">{prayerTimes.asr}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-orange-100 hover:bg-orange-200'} mb-1 transition-colors duration-200 cursor-pointer`}>
                    <p className="font-bold font-arabic">المغرب</p>
                    <p dir="ltr">{prayerTimes.maghrib}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} mb-1 transition-colors duration-200 cursor-pointer`}>
                    <p className="font-bold font-arabic">العشاء</p>
                    <p dir="ltr">{prayerTimes.isha}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Recent Notifications */}
      <motion.div variants={itemVariants}>
        <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-arabic">أحدث الإشعارات</h2>
            {notifications.length > 0 && (
              <motion.button
                className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {}}
              >
                عرض الكل
              </motion.button>
            )}
          </div>
          
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center py-6 text-gray-500 dark:text-gray-400 font-arabic">لا توجد إشعارات حتى الآن</p>
            ) : (
              notifications.slice(0, 3).map(notification => (
                <motion.div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 hover:border-gray-300 bg-white'} flex justify-between items-start transition-colors duration-200 cursor-pointer`}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div>
                    <p className="text-lg mb-1 font-arabic">{notification.content.length > 60 ? notification.content.substring(0, 60) + '...' : notification.content}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notification.source}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{notification.time}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${notification.type === 'quran' ? (darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800') : (darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800')}`}>
                    {notification.type === 'quran' ? 'قرآن' : 'حديث'}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;
