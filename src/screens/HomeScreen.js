import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, MessageSquare, RefreshCw, ChevronRight, Clock, Calendar, MapPin, Sun, Moon, Bell } from 'lucide-react';
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
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', remaining: '' });
  const [location, setLocation] = useState('');
  
  // تحديد الصلاة التالية
  useEffect(() => {
    if (prayerTimes) {
      const getCurrentTime = () => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
      };
      
      const getTimeInMinutes = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'م' && hours !== 12) hours += 12;
        if (period === 'ص' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      
      const updateNextPrayer = () => {
        const currentTime = getCurrentTime();
        const prayers = [
          { name: 'الفجر', time: prayerTimes.fajr },
          { name: 'الشروق', time: prayerTimes.sunrise },
          { name: 'الظهر', time: prayerTimes.dhuhr },
          { name: 'العصر', time: prayerTimes.asr },
          { name: 'المغرب', time: prayerTimes.maghrib },
          { name: 'العشاء', time: prayerTimes.isha }
        ];
        
        // تحويل أوقات الصلاة إلى دقائق
        const prayerMinutes = prayers.map(prayer => ({
          ...prayer,
          minutes: getTimeInMinutes(prayer.time)
        }));
        
        // ترتيب الصلوات حسب الوقت
        prayerMinutes.sort((a, b) => a.minutes - b.minutes);
        
        // البحث عن الصلاة التالية
        let nextPrayerIndex = prayerMinutes.findIndex(prayer => prayer.minutes > currentTime);
        
        // إذا لم يتم العثور على صلاة تالية، فإن الصلاة التالية هي الفجر في اليوم التالي
        if (nextPrayerIndex === -1) {
          nextPrayerIndex = 0;
          prayerMinutes[nextPrayerIndex].minutes += 24 * 60; // إضافة 24 ساعة
        }
        
        const next = prayerMinutes[nextPrayerIndex];
        
        // حساب الوقت المتبقي
        let remainingMinutes = next.minutes - currentTime;
        if (remainingMinutes < 0) remainingMinutes += 24 * 60;
        
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remainingMins = remainingMinutes % 60;
        
        setNextPrayer({
          name: next.name,
          time: next.time,
          remaining: `${remainingHours}:${remainingMins.toString().padStart(2, '0')}`
        });
      };
      
      updateNextPrayer();
      const interval = setInterval(updateNextPrayer, 60000); // تحديث كل دقيقة
      
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);
  
  // محاكاة الحصول على الموقع
  useEffect(() => {
    setTimeout(() => {
      setLocation('الرياض، المملكة العربية السعودية');
    }, 1000);
  }, []);
  
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
    <div className={`animate-pulse p-6 rounded-2xl shadow-soft ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
      <div className={`h-5 w-1/3 mb-4 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
      <div className={`h-20 w-full mb-4 rounded-xl ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
      <div className="flex justify-between items-center">
        <div className={`h-4 w-1/4 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
          <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
        </div>
      </div>
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-100'} ${darkMode ? 'text-red-200' : 'text-red-800'} mb-4`}>
      <p className="font-arabic">{message}</p>
      <motion.button 
        className={`mt-2 px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-red-800 hover:bg-red-700' : 'bg-red-100 hover:bg-red-200'}`}
        onClick={() => window.location.reload()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        إعادة المحاولة
      </motion.button>
    </div>
  );

  return (
    <motion.div 
      className="space-y-6 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Next Prayer Card */}
      <motion.div variants={itemVariants} className="mb-6">
        {loadingPrayerTimes ? (
          <div className={`animate-pulse p-6 rounded-2xl shadow-soft ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
            <div className="flex justify-between">
              <div className={`h-6 w-1/3 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
              <div className={`h-6 w-1/4 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
            </div>
            <div className="flex justify-center items-center my-6">
              <div className={`h-20 w-20 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
            </div>
            <div className="flex justify-between">
              <div className={`h-4 w-1/4 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
              <div className={`h-4 w-1/5 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
            </div>
          </div>
        ) : (
          <div className={`p-6 rounded-2xl shadow-soft overflow-hidden relative ${darkMode ? 'bg-gradient-to-br from-primary-900/40 to-primary-800/20 border border-primary-800/30' : 'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-100'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 z-0"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/10 rounded-full -ml-12 -mb-12 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold font-display mb-1">
                    {nextPrayer.name}
                  </h2>
                  <div className="flex items-center text-sm opacity-80">
                    <Clock size={14} className="inline-block ml-1" />
                    <span>الصلاة القادمة</span>
                  </div>
                </div>
                <div className={`text-center px-3 py-1 rounded-lg text-lg font-bold ${darkMode ? 'bg-primary-800/50' : 'bg-primary-200/70'}`} dir="ltr">
                  {nextPrayer.time}
                </div>
              </div>
              
              <div className="flex justify-center my-6">
                <motion.div 
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${darkMode ? 'bg-primary-800/50' : 'bg-primary-200/70'} text-2xl font-bold`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  dir="ltr"
                >
                  {nextPrayer.remaining}
                </motion.div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center opacity-80">
                  <MapPin size={14} className="inline-block ml-1" />
                  <span>{location || 'جاري تحديد الموقع...'}</span>
                </div>
                <div className="flex items-center opacity-80">
                  <Calendar size={14} className="inline-block ml-1" />
                  <span>{new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Current Quran Verse Section */}
      <motion.div variants={itemVariants}>
        {quranError && <ErrorMessage message={quranError} />}
        
        {loadingQuran ? (
          <SkeletonLoader />
        ) : (
          <div className={`p-6 rounded-2xl shadow-soft relative overflow-hidden ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-100'}`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/5 rounded-full -mr-20 -mt-20 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400 font-display">آية اليوم</h2>
                <motion.button 
                  onClick={fetchRandomVerse}
                  className={`px-3 py-1 rounded-full text-xs flex items-center ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw size={12} className="ml-1" />
                  <span>تحديث</span>
                </motion.button>
              </div>
              
              {verse && (
                <>
                  <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-neutral-700/50' : 'bg-neutral-50'}`}>
                    <p className="text-xl mb-2 leading-relaxed font-arabic">{verse.text}</p>
                    <div className="text-sm opacity-80">سورة {verse.surah} - آية {verse.ayah}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <motion.button
                      className={`flex items-center text-sm ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
                      whileHover={{ x: 5 }}
                    >
                      <span>عرض التفسير</span>
                      <ChevronRight size={16} />
                    </motion.button>
                    
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <motion.button 
                        onClick={() => toggleFavorite(verse, 'quran')} 
                        className={`p-2 rounded-full ${isItemFavorite(verse, 'quran') ? 'text-red-500' : darkMode ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-500 hover:text-neutral-700'} ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isItemFavorite(verse, 'quran') ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                      >
                        <Heart size={20} fill={isItemFavorite(verse, 'quran') ? "currentColor" : "none"} />
                      </motion.button>
                      <motion.button 
                        onClick={() => shareContent(verse.text, `سورة ${verse.surah} - آية ${verse.ayah}`)} 
                        className={`p-2 rounded-full ${darkMode ? 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'}`}
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
          </div>
        )}
      </motion.div>
      
      {/* Current Hadith Section */}
      <motion.div variants={itemVariants}>
        {hadithError && <ErrorMessage message={hadithError} />}
        
        {loadingHadith ? (
          <SkeletonLoader />
        ) : (
          <div className={`p-6 rounded-2xl shadow-soft relative overflow-hidden ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-100'}`}>
            <div className="absolute top-0 left-0 w-40 h-40 bg-secondary-500/5 rounded-full -ml-20 -mt-20 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-secondary-600 dark:text-secondary-400 font-display">حديث اليوم</h2>
                <motion.button 
                  onClick={fetchRandomHadith}
                  className={`px-3 py-1 rounded-full text-xs flex items-center ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw size={12} className="ml-1" />
                  <span>تحديث</span>
                </motion.button>
              </div>
              
              {hadith && (
                <>
                  <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-neutral-700/50' : 'bg-neutral-50'}`}>
                    <p className="text-xl mb-2 leading-relaxed font-arabic">{hadith.text}</p>
                    <div className="text-sm opacity-80">رواه {hadith.narrator}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <motion.button
                      className={`flex items-center text-sm ${darkMode ? 'text-secondary-400 hover:text-secondary-300' : 'text-secondary-600 hover:text-secondary-700'}`}
                      whileHover={{ x: 5 }}
                    >
                      <span>عرض الشرح</span>
                      <ChevronRight size={16} />
                    </motion.button>
                    
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <motion.button 
                        onClick={() => toggleFavorite(hadith, 'hadith')} 
                        className={`p-2 rounded-full ${isItemFavorite(hadith, 'hadith') ? 'text-red-500' : darkMode ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-500 hover:text-neutral-700'} ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isItemFavorite(hadith, 'hadith') ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                      >
                        <Heart size={20} fill={isItemFavorite(hadith, 'hadith') ? "currentColor" : "none"} />
                      </motion.button>
                      <motion.button 
                        onClick={() => shareContent(hadith.text, `رواه ${hadith.narrator}`)} 
                        className={`p-2 rounded-full ${darkMode ? 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'}`}
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
          </div>
        )}
      </motion.div>
      
      {/* Prayer Times Section */}
      <motion.div variants={itemVariants}>
        {prayerTimesError && <ErrorMessage message={prayerTimesError} />}
        
        {loadingPrayerTimes ? (
          <div className={`p-6 rounded-2xl shadow-soft ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-100'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-display">مواقيت الصلاة</h2>
              <div className={`px-3 py-1 rounded-lg text-xs ${darkMode ? 'bg-neutral-700' : 'bg-neutral-100'}`}>
                {new Date().toLocaleDateString('ar-SA', { weekday: 'long' })}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="text-center animate-pulse">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-neutral-700' : 'bg-neutral-100'} mb-1`}>
                    <div className={`h-5 w-16 mx-auto mb-2 rounded-full ${darkMode ? 'bg-neutral-600' : 'bg-neutral-200'}`}></div>
                    <div className={`h-4 w-12 mx-auto rounded-full ${darkMode ? 'bg-neutral-600' : 'bg-neutral-200'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`p-6 rounded-2xl shadow-soft ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-100'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-display">مواقيت الصلاة</h2>
              <div className={`px-3 py-1 rounded-lg text-xs ${darkMode ? 'bg-neutral-700' : 'bg-neutral-100'} flex items-center`}>
                <Calendar size={12} className="ml-1" />
                <span>{new Date().toLocaleDateString('ar-SA', { weekday: 'long' })}</span>
              </div>
            </div>
            
            {prayerTimes && (
              <div className="grid grid-cols-3 gap-3">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`p-3 rounded-xl ${nextPrayer.name === 'الفجر' 
                    ? (darkMode ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-800/30' : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-100') 
                    : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-50 hover:bg-neutral-100')} 
                    transition-colors duration-200 cursor-pointer`}
                >
                  <p className="font-bold font-arabic">الفجر</p>
                  <p dir="ltr" className={nextPrayer.name === 'الفجر' ? 'font-bold' : ''}>{prayerTimes.fajr}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-3 rounded-xl ${nextPrayer.name === 'الشروق' 
                  ? (darkMode ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-800/30' : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-100') 
                  : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-50 hover:bg-neutral-100')} 
                  transition-colors duration-200 cursor-pointer`}
                >
                  <p className="font-bold font-arabic">الشروق</p>
                  <p dir="ltr" className={nextPrayer.name === 'الشروق' ? 'font-bold' : ''}>{prayerTimes.sunrise}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-3 rounded-xl ${nextPrayer.name === 'الظهر' 
                  ? (darkMode ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100') 
                  : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-50 hover:bg-neutral-100')} 
                  transition-colors duration-200 cursor-pointer`}
                >
                  <p className="font-bold font-arabic">الظهر</p>
                  <p dir="ltr" className={nextPrayer.name === 'الظهر' ? 'font-bold' : ''}>{prayerTimes.dhuhr}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-3 rounded-xl ${nextPrayer.name === 'العصر' 
                  ? (darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 border border-indigo-800/30' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100') 
                  : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-50 hover:bg-neutral-100')} 
                  transition-colors duration-200 cursor-pointer`}
                >
                  <p className="font-bold font-arabic">العصر</p>
                  <p dir="ltr" className={nextPrayer.name === 'العصر' ? 'font-bold' : ''}>{prayerTimes.asr}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-3 rounded-xl ${nextPrayer.name === 'المغرب' 
                  ? (darkMode ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-800/30' : 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-100') 
                  : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-50 hover:bg-neutral-100')} 
                  transition-colors duration-200 cursor-pointer`}
                >
                  <p className="font-bold font-arabic">المغرب</p>
                  <p dir="ltr" className={nextPrayer.name === 'المغرب' ? 'font-bold' : ''}>{prayerTimes.maghrib}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-3 rounded-xl ${nextPrayer.name === 'العشاء' 
                  ? (darkMode ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-800/30' : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100') 
                  : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-50 hover:bg-neutral-100')} 
                  transition-colors duration-200 cursor-pointer`}
                >
                  <p className="font-bold font-arabic">العشاء</p>
                  <p dir="ltr" className={nextPrayer.name === 'العشاء' ? 'font-bold' : ''}>{prayerTimes.isha}</p>
                </div>
              </motion.div>
            </div>
            )}
            
            <div className="mt-4 flex justify-center">
              <motion.button
                className={`px-4 py-2 rounded-lg text-sm flex items-center ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar size={14} className="ml-1" />
                <span>عرض التقويم الشهري</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Recent Notifications */}
      <motion.div variants={itemVariants}>
        <div className={`p-6 rounded-2xl shadow-soft ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-display">أحدث الإشعارات</h2>
            {notifications.length > 0 && (
              <motion.button
                className={`text-xs px-3 py-1 rounded-full flex items-center ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {}}
              >
                <span>عرض الكل</span>
                <ChevronRight size={14} className="mr-1" />
              </motion.button>
            )}
          </div>
          
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className={`p-8 rounded-xl ${darkMode ? 'bg-neutral-700/30' : 'bg-neutral-50'} flex flex-col items-center justify-center`}>
                <Bell size={40} className="mb-3 opacity-30" />
                <p className="text-center text-lg font-arabic">لا توجد إشعارات حتى الآن</p>
                <p className="text-center text-sm opacity-70 mt-1">ستظهر هنا الإشعارات الجديدة عند وصولها</p>
              </div>
            ) : (
              <AnimatePresence>
                {notifications.slice(0, 3).map(notification => (
                  <motion.div 
                    key={notification.id} 
                    className={`p-4 rounded-xl ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-50 hover:bg-neutral-100'} flex justify-between items-start transition-colors duration-200 cursor-pointer`}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div>
                      <p className="text-lg mb-1 font-arabic">{notification.content.length > 60 ? notification.content.substring(0, 60) + '...' : notification.content}</p>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs opacity-70">
                        <span>{notification.source}</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-current"></span>
                        <span dir="ltr">{notification.time}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs ${notification.type === 'quran' 
                      ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800') 
                      : (darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800')}`}
                    >
                      {notification.type === 'quran' ? 'قرآن' : 'حديث'}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1 rtl:space-x-reverse">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i === 0 
                      ? (darkMode ? 'bg-primary-500' : 'bg-primary-500') 
                      : (darkMode ? 'bg-neutral-700' : 'bg-neutral-300')}`}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Daily Theme Section */}
      <motion.div variants={itemVariants}>
        <div className={`p-6 rounded-2xl shadow-soft overflow-hidden relative ${darkMode ? 'bg-gradient-to-br from-accent-900/30 to-accent-800/20 border border-accent-800/30' : 'bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-100'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full -mr-16 -mt-16 z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/10 rounded-full -ml-12 -mb-12 z-0"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-display">موضوع اليوم</h2>
              <div className={`px-3 py-1 rounded-lg text-xs ${darkMode ? 'bg-accent-800/50' : 'bg-accent-200/70'}`}>
                {new Date().toLocaleDateString('ar-SA', { weekday: 'long' })}
              </div>
            </div>
            
            <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-accent-800/30' : 'bg-accent-50/70'}`}>
              <h3 className="text-lg font-bold mb-2 font-arabic">فضل الذكر</h3>
              <p className="text-sm leading-relaxed opacity-90">
                الذكر هو من أفضل العبادات وأحبها إلى الله تعالى، وهو سبب لطمأنينة القلوب وراحة النفوس، كما قال تعالى: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ".
              </p>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                className={`px-4 py-2 rounded-lg text-sm flex items-center ${darkMode ? 'bg-accent-800/50 hover:bg-accent-700/50' : 'bg-accent-200/70 hover:bg-accent-300/70'}`}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>اقرأ المزيد</span>
                <ChevronRight size={16} className="mr-1" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Day/Night Toggle */}
      <motion.div 
        variants={itemVariants}
        className="fixed bottom-20 right-4 z-30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <motion.button
          className={`w-12 h-12 rounded-full shadow-elegant flex items-center justify-center ${
            darkMode 
              ? 'bg-neutral-800 text-yellow-300 border border-neutral-700' 
              : 'bg-white text-blue-600 border border-neutral-200'
          }`}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {}}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;
