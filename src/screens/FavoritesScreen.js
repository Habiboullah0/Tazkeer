import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import { useQuranVerse, useHadith } from '../hooks/useAPI';

const FavoritesScreen = ({ 
  shareContent, 
  darkMode 
}) => {
  // State for favorites
  const [favorites, setFavorites] = useState([]);
  
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
  
  // Load favorites from local storage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  
  // Save favorites to local storage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Toggle favorite status
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
  
  // Clear all favorites
  const clearAllFavorites = () => {
    setFavorites([]);
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
        <h2 className="text-xl font-bold font-arabic">المفضلة</h2>
        <div className="flex items-center">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
            {favorites.length}
          </span>
          <Heart size={20} className="text-red-500" fill="currentColor" />
        </div>
      </div>
      
      {favorites.length === 0 ? (
        <motion.div 
          className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}
          variants={itemVariants}
        >
          <div className="flex flex-col items-center justify-center">
            <Heart size={48} className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
            <p className="text-gray-500 dark:text-gray-400 font-arabic">لا توجد عناصر في المفضلة</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-arabic">أضف آيات وأحاديث إلى المفضلة للوصول إليها بسهولة</p>
          </div>
        </motion.div>
      ) : (
        favorites.map((item) => (
          <motion.div 
            key={`${item.type}-${item.id}`} 
            className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
            variants={itemVariants}
            layout
          >
            <div className="flex justify-between mb-3">
              <span className={`px-2 py-1 rounded text-xs ${
                item.type === 'quran' 
                  ? (darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800') 
                  : (darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800')
              }`}>
                {item.type === 'quran' ? 'قرآن' : 'حديث'}
              </span>
              <motion.button 
                onClick={() => toggleFavorite(item, item.type)} 
                className="text-red-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="إزالة من المفضلة"
              >
                <Heart size={20} fill="currentColor" />
              </motion.button>
            </div>
            
            <p className="text-lg mb-3 leading-relaxed font-arabic">{item.text}</p>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.type === 'quran' 
                  ? `سورة ${item.surah} - آية ${item.ayah}` 
                  : `رواه ${item.narrator}`
                }
              </p>
              
              <div className="flex space-x-2">
                <motion.button 
                  onClick={() => shareContent(
                    item.text, 
                    item.type === 'quran' 
                      ? `سورة ${item.surah} - آية ${item.ayah}` 
                      : `رواه ${item.narrator}`
                  )} 
                  className={`p-2 rounded-full ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="مشاركة"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))
      )}
      
      {favorites.length > 0 && (
        <motion.div 
          className="flex justify-center mt-4"
          variants={itemVariants}
        >
          <motion.button
            className={`flex items-center px-4 py-2 rounded-lg ${
              darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
            } text-white transition-colors duration-200 font-arabic`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFavorites}
          >
            مسح الكل
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FavoritesScreen;
