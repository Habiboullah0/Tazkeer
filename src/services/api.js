import axios from 'axios';

// تكوين Axios مع الإعدادات الافتراضية
const axiosInstance = axios.create({
  timeout: 10000, // 10 ثواني كحد أقصى للانتظار
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// اعتراض الطلبات للتعامل مع الأخطاء بشكل موحد
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // تسجيل الخطأ
    console.error('API Error:', error.message, error.config?.url);
    
    // إعادة تشكيل رسالة الخطأ
    const customError = new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'حدث خطأ أثناء الاتصال بالخادم'
    );
    
    // إضافة بيانات الاستجابة والحالة للخطأ المخصص
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    customError.originalError = error;
    
    return Promise.reject(customError);
  }
);

// مدير التخزين المؤقت
const cacheManager = {
  // المدة الافتراضية للتخزين المؤقت (بالمللي ثانية)
  defaultTTL: 30 * 60 * 1000, // 30 دقيقة
  
  // الحصول على عنصر من التخزين المؤقت
  get: (key) => {
    try {
      const cachedData = localStorage.getItem(`cache_${key}`);
      if (!cachedData) return null;
      
      const { data, expiry } = JSON.parse(cachedData);
      
      // التحقق من صلاحية البيانات المخزنة مؤقتًا
      if (expiry && expiry < Date.now()) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('خطأ في استرجاع البيانات من التخزين المؤقت:', error);
      return null;
    }
  },
  
  // تخزين عنصر في التخزين المؤقت
  set: (key, data, ttl = null) => {
    try {
      const expiry = ttl ? Date.now() + ttl : Date.now() + cacheManager.defaultTTL;
      localStorage.setItem(`cache_${key}`, JSON.stringify({ data, expiry }));
    } catch (error) {
      console.error('خطأ في تخزين البيانات في التخزين المؤقت:', error);
    }
  },
  
  // حذف عنصر من التخزين المؤقت
  remove: (key) => {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('خطأ في حذف البيانات من التخزين المؤقت:', error);
    }
  },
  
  // مسح جميع العناصر المنتهية الصلاحية
  clearExpired: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          const cachedData = localStorage.getItem(key);
          if (cachedData) {
            const { expiry } = JSON.parse(cachedData);
            if (expiry && expiry < Date.now()) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error('خطأ في مسح البيانات المنتهية الصلاحية:', error);
    }
  },
  
  // الحصول على حجم التخزين المؤقت
  getSize: () => {
    try {
      let totalSize = 0;
      let cacheCount = 0;
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          const value = localStorage.getItem(key);
          totalSize += (key.length + value.length) * 2; // تقريبي بالبايت
          cacheCount++;
        }
      });
      
      return {
        totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
        cacheCount
      };
    } catch (error) {
      console.error('خطأ في حساب حجم التخزين المؤقت:', error);
      return { totalSize: '0 KB', cacheCount: 0 };
    }
  }
};

// دالة مساعدة للطلبات مع التخزين المؤقت
const fetchWithCache = async (url, options = {}) => {
  const { 
    method = 'GET', 
    params = {}, 
    data = null, 
    useCache = true, 
    cacheTTL = null,
    cacheKey = null
  } = options;
  
  // إنشاء مفتاح التخزين المؤقت
  const key = cacheKey || `${method}_${url}_${JSON.stringify(params)}`;
  
  // التحقق من وجود البيانات في التخزين المؤقت
  if (method === 'GET' && useCache) {
    const cachedData = cacheManager.get(key);
    if (cachedData) {
      console.log('استخدام البيانات من التخزين المؤقت:', key);
      return cachedData;
    }
  }
  
  // إجراء الطلب
  try {
    const response = await axiosInstance({
      method,
      url,
      params,
      data
    });
    
    // تخزين البيانات في التخزين المؤقت للطلبات GET
    if (method === 'GET' && useCache) {
      cacheManager.set(key, response.data, cacheTTL);
    }
    
    return response.data;
  } catch (error) {
    // إعادة رمي الخطأ للتعامل معه في المستوى الأعلى
    throw error;
  }
};

// تنظيف التخزين المؤقت المنتهي الصلاحية عند بدء التطبيق
cacheManager.clearExpired();

// القرآن الكريم API
export const quranAPI = {
  // الحصول على سورة محددة
  getSurah: async (surahNumber) => {
    try {
      return await fetchWithCache(
        `https://api.quran.com/api/v4/chapters/${surahNumber}`,
        {
          params: { language: 'ar' },
          cacheKey: `quran_surah_${surahNumber}`,
          cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
        }
      );
    } catch (error) {
      console.error('خطأ في الحصول على السورة:', error);
      throw error;
    }
  },
  
  // الحصول على آية محددة
  getVerse: async (surahNumber, verseNumber) => {
    try {
      return await fetchWithCache(
        `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${verseNumber}`,
        {
          params: { language: 'ar', words: true },
          cacheKey: `quran_verse_${surahNumber}_${verseNumber}`,
          cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
        }
      );
    } catch (error) {
      console.error('خطأ في الحصول على الآية:', error);
      throw error;
    }
  },
  
  // الحصول على آية عشوائية
  getRandomVerse: async () => {
    try {
      // التحقق من وجود آيات عشوائية مخزنة مسبقًا
      const cachedRandomVerses = cacheManager.get('quran_random_verses_pool');
      
      if (cachedRandomVerses && cachedRandomVerses.length > 0) {
        // استخدام آية عشوائية من المجموعة المخزنة
        const randomIndex = Math.floor(Math.random() * cachedRandomVerses.length);
        const randomVerse = cachedRandomVerses[randomIndex];
        
        // إزالة الآية المستخدمة من المجموعة لتجنب التكرار
        const updatedVerses = cachedRandomVerses.filter((_, index) => index !== randomIndex);
        cacheManager.set('quran_random_verses_pool', updatedVerses);
        
        return randomVerse;
      }
      
      // اختيار سورة عشوائية (من 1 إلى 114)
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      
      // الحصول على معلومات السورة لمعرفة عدد الآيات
      const surahInfo = await fetchWithCache(
        `https://api.quran.com/api/v4/chapters/${randomSurah}`,
        {
          params: { language: 'ar' },
          cacheKey: `quran_surah_${randomSurah}`,
          cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
        }
      );
      
      const versesCount = surahInfo.chapter.verses_count;
      
      // اختيار آية عشوائية من السورة
      const randomVerse = Math.floor(Math.random() * versesCount) + 1;
      
      // الحصول على الآية
      const verseData = await fetchWithCache(
        `https://api.quran.com/api/v4/verses/by_key/${randomSurah}:${randomVerse}`,
        {
          params: { language: 'ar', words: true },
          cacheKey: `quran_verse_${randomSurah}_${randomVerse}`,
          cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
        }
      );
      
      // تنسيق البيانات
      const verse = verseData.verse;
      const words = verse.words.map(word => word.text_uthmani).join(' ');
      
      const formattedVerse = {
        id: verse.id,
        surah: surahInfo.chapter.name_arabic,
        surahNumber: randomSurah,
        ayah: randomVerse,
        text: words
      };
      
      // تحضير مجموعة من الآيات العشوائية للاستخدام المستقبلي
      this.prepareRandomVersesPool();
      
      return formattedVerse;
    } catch (error) {
      console.error('خطأ في الحصول على آية عشوائية:', error);
      
      // محاولة استخدام آيات مخزنة محليًا في حالة فشل الاتصال
      const fallbackVerses = [
        {
          id: 1,
          surah: "البقرة",
          surahNumber: 2,
          ayah: 152,
          text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ"
        },
        {
          id: 2,
          surah: "الرعد",
          surahNumber: 13,
          ayah: 28,
          text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
        },
        {
          id: 3,
          surah: "طه",
          surahNumber: 20,
          ayah: 14,
          text: "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي"
        }
      ];
      
      return fallbackVerses[Math.floor(Math.random() * fallbackVerses.length)];
    }
  },
  
  // تحضير مجموعة من الآيات العشوائية للاستخدام المستقبلي
  prepareRandomVersesPool: async (count = 10) => {
    try {
      // التحقق من وجود مجموعة مخزنة مسبقًا
      const existingPool = cacheManager.get('quran_random_verses_pool');
      if (existingPool && existingPool.length > 5) return;
      
      const versesPool = [];
      const processedPairs = new Set();
      
      // تحضير آيات عشوائية
      for (let i = 0; i < count; i++) {
        // اختيار سورة عشوائية (من 1 إلى 114)
        const randomSurah = Math.floor(Math.random() * 114) + 1;
        
        // الحصول على معلومات السورة لمعرفة عدد الآيات
        const surahInfo = await fetchWithCache(
          `https://api.quran.com/api/v4/chapters/${randomSurah}`,
          {
            params: { language: 'ar' },
            cacheKey: `quran_surah_${randomSurah}`,
            cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
          }
        );
        
        const versesCount = surahInfo.chapter.verses_count;
        
        // اختيار آية عشوائية من السورة
        const randomVerse = Math.floor(Math.random() * versesCount) + 1;
        
        // تجنب تكرار نفس الآية
        const pairKey = `${randomSurah}:${randomVerse}`;
        if (processedPairs.has(pairKey)) {
          i--; // إعادة المحاولة
          continue;
        }
        
        processedPairs.add(pairKey);
        
        // الحصول على الآية
        const verseData = await fetchWithCache(
          `https://api.quran.com/api/v4/verses/by_key/${randomSurah}:${randomVerse}`,
          {
            params: { language: 'ar', words: true },
            cacheKey: `quran_verse_${randomSurah}_${randomVerse}`,
            cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
          }
        );
        
        // تنسيق البيانات
        const verse = verseData.verse;
        const words = verse.words.map(word => word.text_uthmani).join(' ');
        
        versesPool.push({
          id: verse.id,
          surah: surahInfo.chapter.name_arabic,
          surahNumber: randomSurah,
          ayah: randomVerse,
          text: words
        });
      }
      
      // تخزين المجموعة
      cacheManager.set('quran_random_verses_pool', versesPool, 24 * 60 * 60 * 1000); // يوم واحد
    } catch (error) {
      console.error('خطأ في تحضير مجموعة الآيات العشوائية:', error);
    }
  },
  
  // البحث في القرآن الكريم
  search: async (query, page = 1, size = 20) => {
    try {
      return await fetchWithCache(
        `https://api.quran.com/api/v4/search`,
        {
          params: { q: query, language: 'ar', page, size },
          cacheKey: `quran_search_${query}_${page}_${size}`,
          cacheTTL: 24 * 60 * 60 * 1000 // يوم واحد
        }
      );
    } catch (error) {
      console.error('خطأ في البحث:', error);
      throw error;
    }
  },
  
  // الحصول على تفسير آية
  getTafsir: async (surahNumber, verseNumber, tafsirId = 16) => {
    try {
      return await fetchWithCache(
        `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_ayah/${surahNumber}:${verseNumber}`,
        {
          params: { language: 'ar' },
          cacheKey: `quran_tafsir_${tafsirId}_${surahNumber}_${verseNumber}`,
          cacheTTL: 30 * 24 * 60 * 60 * 1000 // شهر
        }
      );
    } catch (error) {
      console.error('خطأ في الحصول على التفسير:', error);
      throw error;
    }
  },
  
  // الحصول على تلاوة صوتية
  getRecitation: async (surahNumber, reciterId = 7) => {
    try {
      return await fetchWithCache(
        `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahNumber}`,
        {
          cacheKey: `quran_recitation_${reciterId}_${surahNumber}`,
          cacheTTL: 30 * 24 * 60 * 60 * 1000 // شهر
        }
      );
    } catch (error) {
      console.error('خطأ في الحصول على التلاوة:', error);
      throw error;
    }
  }
};

// الأحاديث النبوية API
export const hadithAPI = {
  // البحث عن الأحاديث
  search: async (query) => {
    try {
      return await fetchWithCache(
        `https://dorar-hadith-api.herokuapp.com/v1/site/hadith/search`,
        {
          params: { value: query },
          cacheKey: `hadith_search_${query}`,
          cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
        }
      );
    } catch (error) {
      console.error('خطأ في البحث عن الأحاديث:', error);
      throw error;
    }
  },
  
  // الحصول على حديث عشوائي
  getRandomHadith: async () => {
    try {
      // التحقق من وجود أحاديث عشوائية مخزنة مسبقًا
      const cachedRandomHadiths = cacheManager.get('hadith_random_pool');
      
      if (cachedRandomHadiths && cachedRandomHadiths.length > 0) {
        // استخدام حديث عشوائي من المجموعة المخزنة
        const randomIndex = Math.floor(Math.random() * cachedRandomHadiths.length);
        const randomHadith = cachedRandomHadiths[randomIndex];
        
        // إزالة الحديث المستخدم من المجموعة لتجنب التكرار
        const updatedHadiths = cachedRandomHadiths.filter((_, index) => index !== randomIndex);
        cacheManager.set('hadith_random_pool', updatedHadiths);
        
        return randomHadith;
      }
      
      // قائمة من الكلمات الشائعة للبحث عنها للحصول على أحاديث متنوعة
      const searchTerms = ['ذكر', 'صلاة', 'صدقة', 'إيمان', 'علم', 'صبر', 'توكل', 'رحمة', 'تقوى'];
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const response = await fetchWithCache(
        `https://dorar-hadith-api.herokuapp.com/v1/site/hadith/search`,
        {
          params: { value: randomTerm },
          cacheKey: `hadith_search_${randomTerm}`,
          cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
        }
      );
      
      if (response.data && response.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const hadith = response.data[randomIndex];
        
        const formattedHadith = {
          id: hadith.hadithId || randomIndex + 1,
          text: hadith.hadith,
          narrator: hadith.rawi,
          book: hadith.book,
          grade: hadith.grade
        };
        
        // تحضير مجموعة من الأحاديث العشوائية للاستخدام المستقبلي
        this.prepareRandomHadithsPool(response.data);
        
        return formattedHadith;
      } else {
        throw new Error('لم يتم العثور على أحاديث');
      }
    } catch (error) {
      console.error('خطأ في الحصول على حديث عشوائي:', error);
      
      // محاولة استخدام أحاديث مخزنة محليًا في حالة فشل الاتصال
      const fallbackHadiths = [
        {
          id: 1,
          text: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ",
          narrator: "البخاري",
          book: "صحيح البخاري",
          grade: "صحيح"
        },
        {
          id: 2,
          text: "لَا يَقْعُدُ قَوْمٌ يَذْكُرُونَ اللَّهَ عَزَّ وَجَلَّ إِلَّا حَفَّتْهُمُ الْمَلَائِكَةُ، وَغَشِيَتْهُمُ الرَّحْمَةُ، وَنَزَلَتْ عَلَيْهِمُ السَّكِينَةُ، وَذَكَرَهُمُ اللَّهُ فِيمَنْ عِنْدَهُ",
          narrator: "مسلم",
          book: "صحيح مسلم",
          grade: "صحيح"
        },
        {
          id: 3,
          text: "أَلَا أُنَبِّئُكُمْ بِخَيْرِ أَعْمَالِكُمْ، وَأَزْكَاهَا عِنْدَ مَلِيكِكُمْ، وَأَرْفَعِهَا فِي دَرَجَاتِكُمْ، وَخَيْرٌ لَكُمْ مِنْ إِنْفَاقِ الذَّهَبِ وَالْوَرِقِ، وَخَيْرٌ لَكُمْ مِنْ أَنْ تَلْقَوْا عَدُوَّكُمْ فَتَضْرِبُوا أَعْنَاقَهُمْ وَيَضْرِبُوا أَعْنَاقَكُمْ؟ قَالُوا: بَلَى، قَالَ: ذِكْرُ اللَّهِ تَعَالَى",
          narrator: "الترمذي",
          book: "سنن الترمذي",
          grade: "صحيح"
        }
      ];
      
      return fallbackHadiths[Math.floor(Math.random() * fallbackHadiths.length)];
    }
  },
  
  // تحضير مجموعة من الأحاديث العشوائية للاستخدام المستقبلي
  prepareRandomHadithsPool: (hadiths = null, count = 10) => {
    try {
      // التحقق من وجود مجموعة مخزنة مسبقًا
      const existingPool = cacheManager.get('hadith_random_pool');
      if (existingPool && existingPool.length > 5) return;
      
      // استخدام الأحاديث المقدمة أو البحث عن أحاديث جديدة
      if (hadiths && hadiths.length > 0) {
        const formattedHadiths = hadiths.map((hadith, index) => ({
          id: hadith.hadithId || index + 1,
          text: hadith.hadith,
          narrator: hadith.rawi,
          book: hadith.book,
          grade: hadith.grade
        }));
        
        // تخزين المجموعة
        cacheManager.set('hadith_random_pool', formattedHadiths, 24 * 60 * 60 * 1000); // يوم واحد
      } else {
        // سيتم تنفيذ هذا في المستقبل عند الحاجة
        console.log('تحضير مجموعة الأحاديث العشوائية بدون بيانات مقدمة');
      }
    } catch (error) {
      console.error('خطأ في تحضير مجموعة الأحاديث العشوائية:', error);
    }
  },
  
  // الحصول على أحاديث مشابهة
  getSimilarHadiths: async (hadithId) => {
    try {
      return await fetchWithCache(
        `https://dorar-hadith-api.herokuapp.com/v1/site/hadith/similar/${hadithId}`,
        {
          cacheKey: `hadith_similar_${hadithId}`,
          cacheTTL: 7 * 24 * 60 * 60 * 1000 // أسبوع
        }
      );
    } catch (error) {
      console.error('خطأ في الحصول على الأحاديث المشابهة:', error);
      throw error;
    }
  },
  
  // الحصول على شرح الحديث
  getHadithExplanation: async (hadithId) => {
    try {
      // هذه الدالة تحتاج إلى تنفيذ عندما تتوفر واجهة برمجة تطبيقات لشرح الحديث
      // حاليًا نستخدم بيانات وهمية
      return {
        explanation: "شرح الحديث غير متوفر حاليًا"
      };
    } catch (error) {
      console.error('خطأ في الحصول على شرح الحديث:', error);
      throw error;
    }
  }
};

// مواقيت الصلاة API
export const prayerTimesAPI = {
  // الحصول على مواقيت الصلاة حسب الموقع
  getByCoordinates: async (latitude, longitude, method = 2) => {
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const cacheKey = `prayer_times_coords_${latitude.toFixed(2)}_${longitude.toFixed(2)}_${date}`;
      
      const response = await fetchWithCache(
        `https://api.aladhan.com/v1/timings/${date}`,
        {
          params: { latitude, longitude, method },
          cacheKey,
          cacheTTL: 24 * 60 * 60 * 1000 // يوم واحد
        }
      );
      
      const timings = response.data.timings;
      
      return {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha
      };
    } catch (error) {
      console.error('خطأ في الحصول على مواقيت الصلاة:', error);
      
      // محاولة استخدام مواقيت مخزنة محليًا في حالة فشل الاتصال
      return {
        fajr: "04:15",
        sunrise: "05:45",
        dhuhr: "12:10",
        asr: "15:45",
        maghrib: "18:35",
        isha: "20:05"
      };
    }
  },
  
  // الحصول على مواقيت الصلاة حسب المدينة
  getByCity: async (city, country, method = 2) => {
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const cacheKey = `prayer_times_city_${city}_${country}_${date}`;
      
      const response = await fetchWithCache(
        `https://api.aladhan.com/v1/timingsByCity/${date}`,
        {
          params: { city, country, method },
          cacheKey,
          cacheTTL: 24 * 60 * 60 * 1000 // يوم واحد
        }
      );
      
      const timings = response.data.timings;
      
      return {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha
      };
    } catch (error) {
      console.error('خطأ في الحصول على مواقيت الصلاة:', error);
      throw error;
    }
  },
  
  // الحصول على مواقيت الصلاة لشهر كامل
  getMonthlyByCity: async (city, country, month, year, method = 2) => {
    try {
      const cacheKey = `prayer_times_monthly_${city}_${country}_${month}_${year}`;
      
      return await fetchWithCache(
        `https://api.aladhan.com/v1/calendarByCity/${year}/${month}`,
        {
          params: { city, country, method },
          cacheKey,
          cacheTTL: 30 * 24 * 60 * 60 * 1000 // شهر
        }
      );
    } catch (error) {
      console.error('خطأ في الحصول على مواقيت الصلاة الشهرية:', error);
      throw error;
    }
  },
  
  // الحصول على التقويم الهجري
  getHijriCalendar: async (month, year) => {
    try {
      const cacheKey = `hijri_calendar_${month}_${year}`;
      
      return await fetchWithCache(
        `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`,
        {
          cacheKey,
          cacheTTL: 30 * 24 * 60 * 60 * 1000 // شهر
        }
      );
    } catch (error) {
      console.error('خطأ في الحصول على التقويم الهجري:', error);
      throw error;
    }
  }
};

// وظائف مساعدة
export const helpers = {
  // تخزين البيانات محليًا
  saveToLocalStorage: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('خطأ في حفظ البيانات محليًا:', error);
      return false;
    }
  },
  
  // استرجاع البيانات المخزنة محليًا
  getFromLocalStorage: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('خطأ في استرجاع البيانات المخزنة محليًا:', error);
      return null;
    }
  },
  
  // حذف البيانات المخزنة محليًا
  removeFromLocalStorage: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('خطأ في حذف البيانات المخزنة محليًا:', error);
      return false;
    }
  },
  
  // تنسيق الوقت من 24 ساعة إلى 12 ساعة
  formatTime: (time24) => {
    try {
      if (!time24) return '';
      
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'م' : 'ص';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${period}`;
    } catch (error) {
      console.error('خطأ في تنسيق الوقت:', error);
      return time24 || '';
    }
  },
  
  // تحويل الوقت من 12 ساعة إلى 24 ساعة
  formatTimeTo24: (time12) => {
    try {
      if (!time12) return '';
      
      const [timePart, period] = time12.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      
      if (period === 'م' && hours !== 12) {
        hours += 12;
      } else if (period === 'ص' && hours === 12) {
        hours = 0;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('خطأ في تحويل الوقت إلى 24 ساعة:', error);
      return time12 || '';
    }
  },
  
  // الحصول على الموقع الحالي
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      // التحقق من وجود موقع مخزن مسبقًا
      const cachedLocation = cacheManager.get('user_location');
      if (cachedLocation) {
        console.log('استخدام الموقع من التخزين المؤقت');
        return resolve(cachedLocation);
      }
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            
            // تخزين الموقع مؤقتًا
            cacheManager.set('user_location', location, 12 * 60 * 60 * 1000); // 12 ساعة
            
            resolve(location);
          },
          (error) => {
            console.error('خطأ في الحصول على الموقع:', error);
            
            // استخدام موقع افتراضي في حالة الفشل (الرياض)
            const defaultLocation = { latitude: 24.7136, longitude: 46.6753 };
            resolve(defaultLocation);
          },
          { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 60 * 60 * 1000 // ساعة واحدة
          }
        );
      } else {
        console.error('خدمة تحديد الموقع غير مدعومة في هذا المتصفح');
        
        // استخدام موقع افتراضي في حالة عدم دعم خدمة تحديد الموقع
        const defaultLocation = { latitude: 24.7136, longitude: 46.6753 };
        resolve(defaultLocation);
      }
    });
  },
  
  // الحصول على اسم المدينة من الإحداثيات
  getCityFromCoordinates: async (latitude, longitude) => {
    try {
      const cacheKey = `geocode_${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
      const cachedCity = cacheManager.get(cacheKey);
      
      if (cachedCity) {
        return cachedCity;
      }
      
      const response = await fetchWithCache(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: 'json',
            lat: latitude,
            lon: longitude,
            zoom: 10,
            'accept-language': 'ar'
          },
          cacheKey,
          cacheTTL: 30 * 24 * 60 * 60 * 1000, // شهر
          useCache: true
        }
      );
      
      let city = response.address.city || 
                 response.address.town || 
                 response.address.village || 
                 response.address.county || 
                 'غير معروف';
                 
      let country = response.address.country || 'غير معروف';
      
      return { city, country };
    } catch (error) {
      console.error('خطأ في الحصول على اسم المدينة:', error);
      return { city: 'الرياض', country: 'المملكة العربية السعودية' };
    }
  },
  
  // تنسيق التاريخ
  formatDate: (date, options = {}) => {
    try {
      const defaultOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      
      const mergedOptions = { ...defaultOptions, ...options };
      
      return new Date(date).toLocaleDateString('ar-SA', mergedOptions);
    } catch (error) {
      console.error('خطأ في تنسيق التاريخ:', error);
      return date.toString();
    }
  },
  
  // تحويل النص إلى كلام
  textToSpeech: (text) => {
    try {
      if (!window.speechSynthesis) {
        console.error('خاصية تحويل النص إلى كلام غير مدعومة في هذا المتصفح');
        return false;
      }
      
      // إيقاف أي كلام حالي
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar';
      utterance.rate = 0.9; // سرعة أبطأ قليلاً للعربية
      
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('خطأ في تحويل النص إلى كلام:', error);
      return false;
    }
  },
  
  // مشاركة المحتوى
  shareContent: async (content, title = '') => {
    try {
      if (!navigator.share) {
        // استخدام طريقة بديلة للمشاركة إذا كانت واجهة برمجة المشاركة غير متوفرة
        alert(`تمت نسخ المحتوى: ${content}\nالمصدر: ${title}`);
        await navigator.clipboard.writeText(`${content}\nالمصدر: ${title}`);
        return true;
      }
      
      await navigator.share({
        title: 'مشاركة من تطبيق تذكير',
        text: `${content}\nالمصدر: ${title}`,
        url: window.location.href
      });
      
      return true;
    } catch (error) {
      console.error('خطأ في مشاركة المحتوى:', error);
      
      // محاولة نسخ المحتوى إلى الحافظة في حالة فشل المشاركة
      try {
        await navigator.clipboard.writeText(`${content}\nالمصدر: ${title}`);
        alert('تم نسخ المحتوى إلى الحافظة');
        return true;
      } catch (clipboardError) {
        console.error('خطأ في نسخ المحتوى إلى الحافظة:', clipboardError);
        return false;
      }
    }
  },
  
  // الحصول على حجم التخزين المؤقت
  getCacheSize: () => {
    return cacheManager.getSize();
  },
  
  // مسح التخزين المؤقت
  clearCache: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('خطأ في مسح التخزين المؤقت:', error);
      return false;
    }
  }
};

// تصدير مدير التخزين المؤقت للاستخدام المباشر
export { cacheManager };

// تصدير دالة fetchWithCache للاستخدام المباشر
export { fetchWithCache };
