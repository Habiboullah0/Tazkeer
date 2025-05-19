import React, { useState, useEffect } from 'react';
import { quranAPI, hadithAPI, prayerTimesAPI, helpers } from '../services/api';

// Custom hook for fetching Quran verse
export const useQuranVerse = (initialVerse = null) => {
  const [verse, setVerse] = useState(initialVerse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomVerse = async () => {
    try {
      setLoading(true);
      const data = await quranAPI.getRandomVerse();
      setVerse(data);
      setError(null);
      
      // Cache the verse
      helpers.saveToLocalStorage('lastQuranVerse', data);
      
      return data;
    } catch (err) {
      console.error('Error fetching random verse:', err);
      setError('حدث خطأ أثناء جلب الآية. يرجى المحاولة مرة أخرى.');
      
      // Try to get cached verse if available
      const cachedVerse = helpers.getFromLocalStorage('lastQuranVerse');
      if (cachedVerse) {
        setVerse(cachedVerse);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchVerseById = async (surahNumber, verseNumber) => {
    try {
      setLoading(true);
      const response = await quranAPI.getVerse(surahNumber, verseNumber);
      
      // Format the response
      const verse = response.verse;
      const words = verse.words.map(word => word.text_uthmani).join(' ');
      
      const formattedVerse = {
        id: verse.id,
        surah: verse.chapter_name,
        surahNumber: surahNumber,
        ayah: verseNumber,
        text: words
      };
      
      setVerse(formattedVerse);
      setError(null);
      return formattedVerse;
    } catch (err) {
      console.error('Error fetching verse by ID:', err);
      setError('حدث خطأ أثناء جلب الآية. يرجى المحاولة مرة أخرى.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get cached verse first
    const cachedVerse = helpers.getFromLocalStorage('lastQuranVerse');
    
    if (cachedVerse) {
      setVerse(cachedVerse);
      setLoading(false);
    } else {
      fetchRandomVerse();
    }
  }, []);

  return { verse, loading, error, fetchRandomVerse, fetchVerseById };
};

// Custom hook for fetching Hadith
export const useHadith = (initialHadith = null) => {
  const [hadith, setHadith] = useState(initialHadith);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomHadith = async () => {
    try {
      setLoading(true);
      const data = await hadithAPI.getRandomHadith();
      setHadith(data);
      setError(null);
      
      // Cache the hadith
      helpers.saveToLocalStorage('lastHadith', data);
      
      return data;
    } catch (err) {
      console.error('Error fetching random hadith:', err);
      setError('حدث خطأ أثناء جلب الحديث. يرجى المحاولة مرة أخرى.');
      
      // Try to get cached hadith if available
      const cachedHadith = helpers.getFromLocalStorage('lastHadith');
      if (cachedHadith) {
        setHadith(cachedHadith);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchHadiths = async (query) => {
    try {
      setLoading(true);
      const response = await hadithAPI.search(query);
      
      if (response.data && response.data.length > 0) {
        // Format the hadiths
        const formattedHadiths = response.data.map(item => ({
          id: item.hadithId || Math.random().toString(36).substr(2, 9),
          text: item.hadith,
          narrator: item.rawi,
          book: item.book,
          grade: item.grade
        }));
        
        return formattedHadiths;
      } else {
        return [];
      }
    } catch (err) {
      console.error('Error searching hadiths:', err);
      setError('حدث خطأ أثناء البحث عن الأحاديث. يرجى المحاولة مرة أخرى.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get cached hadith first
    const cachedHadith = helpers.getFromLocalStorage('lastHadith');
    
    if (cachedHadith) {
      setHadith(cachedHadith);
      setLoading(false);
    } else {
      fetchRandomHadith();
    }
  }, []);

  return { hadith, loading, error, fetchRandomHadith, searchHadiths };
};

// Custom hook for fetching Prayer Times
export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrayerTimesByLocation = async () => {
    try {
      setLoading(true);
      
      // Try to get location
      const location = await helpers.getCurrentLocation();
      
      const data = await prayerTimesAPI.getByCoordinates(
        location.latitude,
        location.longitude
      );
      
      // Format times to 12-hour format
      const formattedTimes = {
        fajr: helpers.formatTime(data.fajr),
        sunrise: helpers.formatTime(data.sunrise),
        dhuhr: helpers.formatTime(data.dhuhr),
        asr: helpers.formatTime(data.asr),
        maghrib: helpers.formatTime(data.maghrib),
        isha: helpers.formatTime(data.isha)
      };
      
      setPrayerTimes(formattedTimes);
      setError(null);
      
      // Cache the prayer times with timestamp
      helpers.saveToLocalStorage('lastPrayerTimes', {
        times: formattedTimes,
        timestamp: new Date().getTime()
      });
      
      return formattedTimes;
    } catch (err) {
      console.error('Error fetching prayer times by location:', err);
      setError('حدث خطأ أثناء جلب مواقيت الصلاة. يرجى المحاولة مرة أخرى.');
      
      // Try to get cached prayer times if available
      const cachedPrayerTimes = helpers.getFromLocalStorage('lastPrayerTimes');
      if (cachedPrayerTimes) {
        setPrayerTimes(cachedPrayerTimes.times);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchPrayerTimesByCity = async (city, country) => {
    try {
      setLoading(true);
      const data = await prayerTimesAPI.getByCity(city, country);
      
      // Format times to 12-hour format
      const formattedTimes = {
        fajr: helpers.formatTime(data.fajr),
        sunrise: helpers.formatTime(data.sunrise),
        dhuhr: helpers.formatTime(data.dhuhr),
        asr: helpers.formatTime(data.asr),
        maghrib: helpers.formatTime(data.maghrib),
        isha: helpers.formatTime(data.isha)
      };
      
      setPrayerTimes(formattedTimes);
      setError(null);
      
      // Cache the prayer times with timestamp and location
      helpers.saveToLocalStorage('lastPrayerTimes', {
        times: formattedTimes,
        timestamp: new Date().getTime(),
        city,
        country
      });
      
      return formattedTimes;
    } catch (err) {
      console.error('Error fetching prayer times by city:', err);
      setError('حدث خطأ أثناء جلب مواقيت الصلاة. يرجى المحاولة مرة أخرى.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get cached prayer times first
    const cachedPrayerTimes = helpers.getFromLocalStorage('lastPrayerTimes');
    
    if (cachedPrayerTimes) {
      // Check if the cached prayer times are from today
      const now = new Date().getTime();
      const cacheTime = cachedPrayerTimes.timestamp;
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (now - cacheTime < oneDay) {
        // Use cached prayer times if they're from today
        setPrayerTimes(cachedPrayerTimes.times);
        setLoading(false);
      } else {
        // Cached prayer times are outdated, fetch new ones
        fetchPrayerTimesByLocation();
      }
    } else {
      // No cached prayer times, fetch new ones
      fetchPrayerTimesByLocation();
    }
  }, []);

  return { 
    prayerTimes, 
    loading, 
    error, 
    fetchPrayerTimesByLocation, 
    fetchPrayerTimesByCity 
  };
};
