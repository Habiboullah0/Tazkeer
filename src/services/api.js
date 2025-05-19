import axios from 'axios';

// القرآن الكريم API
export const quranAPI = {
  // الحصول على سورة محددة
  getSurah: async (surahNumber) => {
    try {
      const response = await axios.get(`https://api.quran.com/api/v4/chapters/${surahNumber}?language=ar`);
      return response.data;
    } catch (error) {
      console.error('خطأ في الحصول على السورة:', error);
      throw error;
    }
  },
  
  // الحصول على آية محددة
  getVerse: async (surahNumber, verseNumber) => {
    try {
      const response = await axios.get(`https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${verseNumber}?language=ar&words=true`);
      return response.data;
    } catch (error) {
      console.error('خطأ في الحصول على الآية:', error);
      throw error;
    }
  },
  
  // الحصول على آية عشوائية
  getRandomVerse: async () => {
    try {
      // اختيار سورة عشوائية (من 1 إلى 114)
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      
      // الحصول على معلومات السورة لمعرفة عدد الآيات
      const surahInfo = await axios.get(`https://api.quran.com/api/v4/chapters/${randomSurah}?language=ar`);
      const versesCount = surahInfo.data.chapter.verses_count;
      
      // اختيار آية عشوائية من السورة
      const randomVerse = Math.floor(Math.random() * versesCount) + 1;
      
      // الحصول على الآية
      const verseData = await axios.get(`https://api.quran.com/api/v4/verses/by_key/${randomSurah}:${randomVerse}?language=ar&words=true`);
      
      // تنسيق البيانات
      const verse = verseData.data.verse;
      const words = verse.words.map(word => word.text_uthmani).join(' ');
      
      return {
        id: verse.id,
        surah: surahInfo.data.chapter.name_arabic,
        surahNumber: randomSurah,
        ayah: randomVerse,
        text: words
      };
    } catch (error) {
      console.error('خطأ في الحصول على آية عشوائية:', error);
      throw error;
    }
  },
  
  // البحث في القرآن الكريم
  search: async (query, page = 1, size = 20) => {
    try {
      const response = await axios.get(`https://api.quran.com/api/v4/search?q=${query}&language=ar&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('خطأ في البحث:', error);
      throw error;
    }
  },
  
  // الحصول على تفسير آية
  getTafsir: async (surahNumber, verseNumber, tafsirId = 16) => {
    try {
      const response = await axios.get(`https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_ayah/${surahNumber}:${verseNumber}?language=ar`);
      return response.data;
    } catch (error) {
      console.error('خطأ في الحصول على التفسير:', error);
      throw error;
    }
  },
  
  // الحصول على تلاوة صوتية
  getRecitation: async (surahNumber, reciterId = 7) => {
    try {
      const response = await axios.get(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahNumber}`);
      return response.data;
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
      const response = await axios.get(`https://dorar-hadith-api.herokuapp.com/v1/site/hadith/search?value=${query}`);
      return response.data;
    } catch (error) {
      console.error('خطأ في البحث عن الأحاديث:', error);
      throw error;
    }
  },
  
  // الحصول على حديث عشوائي
  getRandomHadith: async () => {
    try {
      // قائمة من الكلمات الشائعة للبحث عنها للحصول على أحاديث متنوعة
      const searchTerms = ['ذكر', 'صلاة', 'صدقة', 'إيمان', 'علم', 'صبر', 'توكل', 'رحمة', 'تقوى'];
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const response = await axios.get(`https://dorar-hadith-api.herokuapp.com/v1/site/hadith/search?value=${randomTerm}`);
      
      if (response.data.data && response.data.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.data.length);
        const hadith = response.data.data[randomIndex];
        
        return {
          id: hadith.hadithId || randomIndex + 1,
          text: hadith.hadith,
          narrator: hadith.rawi,
          book: hadith.book,
          grade: hadith.grade
        };
      } else {
        throw new Error('لم يتم العثور على أحاديث');
      }
    } catch (error) {
      console.error('خطأ في الحصول على حديث عشوائي:', error);
      throw error;
    }
  },
  
  // الحصول على أحاديث مشابهة
  getSimilarHadiths: async (hadithId) => {
    try {
      const response = await axios.get(`https://dorar-hadith-api.herokuapp.com/v1/site/hadith/similar/${hadithId}`);
      return response.data;
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
      
      const response = await axios.get(`https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${method}`);
      
      const timings = response.data.data.timings;
      
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
  
  // الحصول على مواقيت الصلاة حسب المدينة
  getByCity: async (city, country, method = 2) => {
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=${country}&method=${method}`);
      
      const timings = response.data.data.timings;
      
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
      const response = await axios.get(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}`);
      return response.data;
    } catch (error) {
      console.error('خطأ في الحصول على مواقيت الصلاة الشهرية:', error);
      throw error;
    }
  },
  
  // الحصول على التقويم الهجري
  getHijriCalendar: async (month, year) => {
    try {
      const response = await axios.get(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`);
      return response.data;
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
    } catch (error) {
      console.error('خطأ في حفظ البيانات محليًا:', error);
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
  
  // تنسيق الوقت من 24 ساعة إلى 12 ساعة
  formatTime: (time24) => {
    try {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'م' : 'ص';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${period}`;
    } catch (error) {
      console.error('خطأ في تنسيق الوقت:', error);
      return time24;
    }
  },
  
  // الحصول على الموقع الحالي
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('خطأ في الحصول على الموقع:', error);
            reject(error);
          }
        );
      } else {
        const error = new Error('خدمة تحديد الموقع غير مدعومة في هذا المتصفح');
        console.error(error);
        reject(error);
      }
    });
  }
};
