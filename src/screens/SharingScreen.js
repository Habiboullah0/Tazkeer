import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Link, Copy, Twitter, Facebook, WhatsApp } from 'lucide-react';

const SharingScreen = ({ darkMode }) => {
  // State for sharing
  const [shareUrl, setShareUrl] = useState('');
  const [shareText, setShareText] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
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
  
  // Reset copy success message after 2 seconds
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);
  
  // Handle copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  // Handle social media sharing
  const handleShare = (platform) => {
    let shareLink = '';
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl || window.location.href);
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
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
        <h2 className="text-xl font-bold font-arabic">المشاركة</h2>
      </div>
      
      {/* Share Content Form */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">مشاركة محتوى</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="shareText" className="block mb-2 text-sm font-medium font-arabic">النص</label>
            <textarea
              id="shareText"
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className={`w-full p-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-primary-500' 
                  : 'bg-gray-100 border-gray-200 focus:border-primary-500'
              } border-2 focus:outline-none transition-colors duration-200 font-arabic`}
              rows={4}
              placeholder="أدخل النص الذي تريد مشاركته..."
            />
          </div>
          
          <div>
            <label htmlFor="shareUrl" className="block mb-2 text-sm font-medium font-arabic">الرابط (اختياري)</label>
            <div className="relative">
              <input
                id="shareUrl"
                type="url"
                value={shareUrl}
                onChange={(e) => setShareUrl(e.target.value)}
                className={`w-full p-3 pl-10 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-primary-500' 
                    : 'bg-gray-100 border-gray-200 focus:border-primary-500'
                } border-2 focus:outline-none transition-colors duration-200`}
                placeholder="https://example.com"
              />
              <Link size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="flex justify-end">
            <motion.button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-primary-600 hover:bg-primary-500' 
                  : 'bg-primary-500 hover:bg-primary-600'
              } text-white transition-colors duration-200 font-arabic flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={18} className="ml-2" />
              مشاركة
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Share Options */}
      {showShareOptions && (
        <motion.div 
          className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4 font-arabic">خيارات المشاركة</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              onClick={() => handleCopy(shareText + (shareUrl ? ` ${shareUrl}` : ''))}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors duration-200 flex flex-col items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Copy size={24} className="mb-2" />
              <span className="font-arabic">{copySuccess ? 'تم النسخ!' : 'نسخ'}</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleShare('twitter')}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'
              } transition-colors duration-200 flex flex-col items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitter size={24} className="mb-2" />
              <span className="font-arabic">تويتر</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleShare('facebook')}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-100 hover:bg-indigo-200'
              } transition-colors duration-200 flex flex-col items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Facebook size={24} className="mb-2" />
              <span className="font-arabic">فيسبوك</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleShare('whatsapp')}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-100 hover:bg-green-200'
              } transition-colors duration-200 flex flex-col items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <WhatsApp size={24} className="mb-2" />
              <span className="font-arabic">واتساب</span>
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* Recent Shares */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">المشاركات الأخيرة</h3>
        
        <div className="space-y-3">
          <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'}`}>
            <p className="text-lg mb-2 font-arabic">فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">سورة البقرة - آية 152</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">منذ 3 دقائق</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'}`}>
            <p className="text-lg mb-2 font-arabic">مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">رواه البخاري</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">منذ يوم واحد</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Sharing Tips */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-3 font-arabic">نصائح للمشاركة</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li className="font-arabic">شارك الآيات والأحاديث مع الأصدقاء والعائلة</li>
          <li className="font-arabic">يمكنك نسخ النص ومشاركته في أي تطبيق</li>
          <li className="font-arabic">أضف رابطًا إلى موقع أو مقال ذي صلة</li>
          <li className="font-arabic">استخدم وسائل التواصل الاجتماعي لنشر المحتوى</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default SharingScreen;
