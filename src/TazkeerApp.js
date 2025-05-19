import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import HomeScreen from './screens/HomeScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';

const TazkeerApp = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [schedules, setSchedules] = useState([
    { id: 1, time: "08:00", type: "quran", active: true },
    { id: 2, time: "12:30", type: "hadith", active: true },
    { id: 3, time: "17:45", type: "quran", active: true },
    { id: 4, time: "21:00", type: "hadith", active: false }
  ]);
  const [settings, setSettings] = useState({
    notificationSound: true,
    vibration: true,
    quranEnabled: true,
    hadithEnabled: true,
    prayerReminders: true,
    frequency: "medium",
    favoriteCategories: ["أذكار الصباح", "أذكار المساء", "فضل الذكر"]
  });
  
  const [currentQuran, setCurrentQuran] = useState(null);
  const [currentHadith, setCurrentHadith] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState({
    quran: true,
    hadith: true,
    prayerTimes: true
  });
  
  // محاكاة جلب البيانات من API
  useEffect(() => {
    // سيتم استبدال هذا بجلب البيانات الفعلية من API
    const mockQuranVerses = [
      { id: 1, surah: "البقرة", ayah: 152, text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ" },
      { id: 2, surah: "الرعد", ayah: 28, text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ" },
      { id: 3, surah: "طه", ayah: 14, text: "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي" },
      { id: 4, surah: "الأحزاب", ayah: 41, text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا" },
      { id: 5, surah: "الجمعة", ayah: 10, text: "وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ" }
    ];
    
    const mockHadithCollection = [
      { id: 1, narrator: "البخاري", text: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ" },
      { id: 2, narrator: "مسلم", text: "لَا يَقْعُدُ قَوْمٌ يَذْكُرُونَ اللَّهَ عَزَّ وَجَلَّ إِلَّا حَفَّتْهُمُ الْمَلَائِكَةُ، وَغَشِيَتْهُمُ الرَّحْمَةُ، وَنَزَلَتْ عَلَيْهِمُ السَّكِينَةُ، وَذَكَرَهُمُ اللَّهُ فِيمَنْ عِنْدَهُ" },
      { id: 3, narrator: "الترمذي", text: "أَلَا أُنَبِّئُكُمْ بِخَيْرِ أَعْمَالِكُمْ، وَأَزْكَاهَا عِنْدَ مَلِيكِكُمْ، وَأَرْفَعِهَا فِي دَرَجَاتِكُمْ، وَخَيْرٌ لَكُمْ مِنْ إِنْفَاقِ الذَّهَبِ وَالْوَرِقِ، وَخَيْرٌ لَكُمْ مِنْ أَنْ تَلْقَوْا عَدُوَّكُمْ فَتَضْرِبُوا أَعْنَاقَهُمْ وَيَضْرِبُوا أَعْنَاقَكُمْ؟ قَالُوا: بَلَى، قَالَ: ذِكْرُ اللَّهِ تَعَالَى" },
      { id: 4, narrator: "ابن ماجه", text: "ما عَمِلَ آدَمِيٌّ عَمَلاً أَنْجَى لَهُ مِنْ عَذَابِ اللَّهِ مِنْ ذِكْرِ اللَّهِ" },
      { id: 5, narrator: "أبو داود", text: "لَا يَقْعُدُ قَوْمٌ يَذْكُرُونَ اللَّهَ إِلَّا نَادَاهُمْ مُنَادٍ مِنَ السَّمَاءِ: قُومُوا مَغْفُورًا لَكُمْ، قَدْ بُدِّلَتْ سَيِّئَاتُكُمْ حَسَنَاتٍ" }
    ];
    
    const mockPrayerTimes = {
      fajr: "04:15",
      sunrise: "05:45",
      dhuhr: "12:10",
      asr: "15:45",
      maghrib: "18:35",
      isha: "20:05"
    };
    
    // محاكاة تأخير الشبكة
    setTimeout(() => {
      setCurrentQuran(mockQuranVerses[Math.floor(Math.random() * mockQuranVerses.length)]);
      setLoading(prev => ({ ...prev, quran: false }));
    }, 1000);
    
    setTimeout(() => {
      setCurrentHadith(mockHadithCollection[Math.floor(Math.random() * mockHadithCollection.length)]);
      setLoading(prev => ({ ...prev, hadith: false }));
    }, 1500);
    
    setTimeout(() => {
      setPrayerTimes(mockPrayerTimes);
      setLoading(prev => ({ ...prev, prayerTimes: false }));
    }, 800);
    
    // محاكاة استلام إشعار جديد كل 15 ثانية
    const notificationInterval = setInterval(() => {
      if (!settings.quranEnabled && !settings.hadithEnabled) return;
      
      const types = [];
      if (settings.quranEnabled) types.push("quran");
      if (settings.hadithEnabled) types.push("hadith");
      
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      let newNotification = {
        id: Date.now(),
        type: randomType,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      
      if (randomType === "quran") {
        const randomVerse = mockQuranVerses[Math.floor(Math.random() * mockQuranVerses.length)];
        newNotification.content = randomVerse.text;
        newNotification.source = `سورة ${randomVerse.surah} - آية ${randomVerse.ayah}`;
      } else {
        const randomHadith = mockHadithCollection[Math.floor(Math.random() * mockHadithCollection.length)];
        newNotification.content = randomHadith.text;
        newNotification.source = `رواه ${randomHadith.narrator}`;
      }
      
      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    }, 15000);
    
    // تغيير الآية والحديث الحالي كل 30 ثانية
    const contentInterval = setInterval(() => {
      setCurrentQuran(mockQuranVerses[Math.floor(Math.random() * mockQuranVerses.length)]);
      setCurrentHadith(mockHadithCollection[Math.floor(Math.random() * mockHadithCollection.length)]);
    }, 30000);
    
    return () => {
      clearInterval(notificationInterval);
      clearInterval(contentInterval);
    };
  }, [settings.quranEnabled, settings.hadithEnabled]);
  
  const toggleFavorite = (item, type) => {
    const exists = favorites.some(fav => 
      fav.type === type && (
        (type === 'quran' && fav.id === item.id) || 
        (type === 'hadith' && fav.id === item.id)
      )
    );
    
    if (exists) {
      setFavorites(favorites.filter(fav => 
        !(fav.type === type && (
          (type === 'quran' && fav.id === item.id) || 
          (type === 'hadith' && fav.id === item.id)
        ))
      ));
    } else {
      setFavorites([...favorites, { ...item, type }]);
    }
  };
  
  const isItemFavorite = (item, type) => {
    return favorites.some(fav => 
      fav.type === type && (
        (type === 'quran' && fav.id === item.id) || 
        (type === 'hadith' && fav.id === item.id)
      )
    );
  };
  
  const addSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      time: "09:00",
      type: "quran",
      active: true
    };
    setSchedules([...schedules, newSchedule]);
  };
  
  const toggleSchedule = (id) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, active: !schedule.active } : schedule
    ));
  };
  
  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };
  
  const updateScheduleTime = (id, time) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, time } : schedule
    ));
  };
  
  const updateScheduleType = (id, type) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, type } : schedule
    ));
  };
  
  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };
  
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const shareContent = (content, source) => {
    // سيتم استبدال هذا بوظيفة المشاركة الفعلية
    alert(`تمت مشاركة: ${content}\nالمصدر: ${source}`);
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white dark' : 'bg-gray-50 text-gray-800'}`} dir="rtl">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <HomeScreen 
              key="home"
              currentQuran={currentQuran}
              currentHadith={currentHadith}
              prayerTimes={prayerTimes}
              notifications={notifications}
              loading={loading}
              isItemFavorite={isItemFavorite}
              toggleFavorite={toggleFavorite}
              shareContent={shareContent}
              darkMode={darkMode}
            />
          )}
          
          {activeTab === "notifications" && (
            <NotificationsScreen 
              key="notifications"
              notifications={notifications}
              markNotificationAsRead={markNotificationAsRead}
              deleteNotification={deleteNotification}
              shareContent={shareContent}
              darkMode={darkMode}
            />
          )}
          
          {activeTab === "schedule" && (
            <ScheduleScreen 
              key="schedule"
              schedules={schedules}
              addSchedule={addSchedule}
              toggleSchedule={toggleSchedule}
              deleteSchedule={deleteSchedule}
              updateScheduleTime={updateScheduleTime}
              updateScheduleType={updateScheduleType}
              darkMode={darkMode}
            />
          )}
          
          {activeTab === "favorites" && (
            <FavoritesScreen 
              key="favorites"
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              shareContent={shareContent}
              darkMode={darkMode}
            />
          )}
          
          {activeTab === "settings" && (
            <SettingsScreen 
              key="settings"
              settings={settings}
              updateSetting={updateSetting}
              darkMode={darkMode}
            />
          )}
        </AnimatePresence>
      </main>
      
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
    </div>
  );
};

export default TazkeerApp;
