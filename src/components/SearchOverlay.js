import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Search, X } from 'lucide-react';

// مكون البحث المتقدم
const SearchOverlay = ({ isOpen, onClose, darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  
  // استرجاع عمليات البحث السابقة من التخزين المحلي
  useEffect(() => {
    const savedSearches = localStorage.getItem('recent_searches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  // حفظ عمليات البحث في التخزين المحلي
  const saveSearch = (query) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
  };
  
  // محاكاة عملية البحث
  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setSearchHistory(prev => [...prev, searchQuery]);
    saveSearch(searchQuery);
    
    // محاكاة تأخير الشبكة
    setTimeout(() => {
      // نتائج بحث وهمية
      const results = [
        {
          id: 1,
          type: 'quran',
          title: 'سورة البقرة - آية 152',
          content: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
          category: 'قرآن'
        },
        {
          id: 2,
          type: 'hadith',
          title: 'صحيح البخاري',
          content: 'مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ',
          category: 'حديث'
        },
        {
          id: 3,
          type: 'reminder',
          title: 'أذكار الصباح',
          content: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
          category: 'ذكر'
        },
        {
          id: 4,
          type: 'article',
          title: 'فضل الذكر',
          content: 'الذكر هو من أفضل العبادات وأحبها إلى الله تعالى...',
          category: 'مقال'
        }
      ];
      
      setSearchResults(results);
      setIsLoading(false);
    }, 800);
  };
  
  // تنفيذ البحث عند الضغط على Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };
  
  // تصفية النتائج حسب التبويب النشط
  const filteredResults = searchResults.filter(result => {
    if (activeTab === 'all') return true;
    return result.type === activeTab;
  });
  
  // مؤثرات الانتقال
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }
  };
  
  const resultVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      } 
    })
  };
  
  // تنظيف عند الإغلاق
  const handleClose = () => {
    onClose();
    // إعادة تعيين الحالة بعد فترة قصيرة للسماح بمؤثر الخروج
    setTimeout(() => {
      setSearchQuery('');
      setSearchResults([]);
      setActiveTab('all');
    }, 300);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={handleClose}
      >
        <motion.div
          className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${
            darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-200'
          }`}
          variants={contentVariants}
          onClick={e => e.stopPropagation()}
        >
          {/* رأس البحث */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center">
              <Search className="mr-2 text-neutral-500 dark:text-neutral-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ابحث عن آيات، أحاديث، أذكار..."
                className={`flex-1 bg-transparent border-none outline-none text-lg ${
                  darkMode ? 'placeholder-neutral-500' : 'placeholder-neutral-400'
                }`}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`p-1 rounded-full ${
                    darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100'
                  }`}
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={performSearch}
                className={`ml-2 px-3 py-1 rounded-lg ${
                  darkMode 
                    ? 'bg-primary-700 hover:bg-primary-600 text-white' 
                    : 'bg-primary-100 hover:bg-primary-200 text-primary-800'
                }`}
              >
                بحث
              </button>
            </div>
            
            {/* عمليات البحث الأخيرة */}
            {!searchResults.length && recentSearches.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(search);
                      performSearch();
                    }}
                    className={`text-xs px-3 py-1 rounded-full ${
                      darkMode 
                        ? 'bg-neutral-700 hover:bg-neutral-600' 
                        : 'bg-neutral-100 hover:bg-neutral-200'
                    }`}
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* تبويبات تصفية النتائج */}
          {searchResults.length > 0 && (
            <div className="border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto">
              <div className="flex p-2 space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap ${
                    activeTab === 'all'
                      ? (darkMode ? 'bg-primary-700 text-white' : 'bg-primary-100 text-primary-800')
                      : (darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100')
                  }`}
                >
                  الكل ({searchResults.length})
                </button>
                <button
                  onClick={() => setActiveTab('quran')}
                  className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap ${
                    activeTab === 'quran'
                      ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800')
                      : (darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100')
                  }`}
                >
                  القرآن ({searchResults.filter(r => r.type === 'quran').length})
                </button>
                <button
                  onClick={() => setActiveTab('hadith')}
                  className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap ${
                    activeTab === 'hadith'
                      ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800')
                      : (darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100')
                  }`}
                >
                  الحديث ({searchResults.filter(r => r.type === 'hadith').length})
                </button>
                <button
                  onClick={() => setActiveTab('reminder')}
                  className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap ${
                    activeTab === 'reminder'
                      ? (darkMode ? 'bg-yellow-700 text-white' : 'bg-yellow-100 text-yellow-800')
                      : (darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100')
                  }`}
                >
                  الأذكار ({searchResults.filter(r => r.type === 'reminder').length})
                </button>
                <button
                  onClick={() => setActiveTab('article')}
                  className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap ${
                    activeTab === 'article'
                      ? (darkMode ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-800')
                      : (darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100')
                  }`}
                >
                  المقالات ({searchResults.filter(r => r.type === 'article').length})
                </button>
              </div>
            </div>
          )}
          
          {/* محتوى البحث */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-neutral-300 dark:border-neutral-600 border-t-primary-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">جاري البحث...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    custom={index}
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer`}
                    onClick={() => {
                      // التنقل إلى النتيجة
                      if (window.navigateToResult) {
                        window.navigateToResult(result);
                      }
                      handleClose();
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            result.type === 'quran' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : result.type === 'hadith'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : result.type === 'reminder'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          }`}>
                            {result.category}
                          </span>
                          <h3 className="mr-2 font-bold">{result.title}</h3>
                        </div>
                        <p className="mt-2 text-lg">{result.content}</p>
                      </div>
                      <ArrowLeft className="mr-2 text-neutral-400" size={16} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : searchQuery && !isLoading ? (
              <div className="p-8 text-center">
                <p className="text-neutral-500 dark:text-neutral-400">لم يتم العثور على نتائج</p>
                <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500">حاول استخدام كلمات مفتاحية مختلفة</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="mx-auto text-neutral-300 dark:text-neutral-600" size={48} />
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">ابحث عن آيات، أحاديث، أذكار، ومقالات</p>
                <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500">اكتب ما تبحث عنه واضغط Enter</p>
              </div>
            )}
          </div>
          
          {/* تذييل البحث */}
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
            <button
              onClick={handleClose}
              className={`px-3 py-1 rounded-lg text-sm ${
                darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100'
              }`}
            >
              إغلاق
            </button>
            
            {searchResults.length > 0 && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {filteredResults.length} نتيجة
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchOverlay;
