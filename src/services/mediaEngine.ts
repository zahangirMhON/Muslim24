export interface MediaScheduleItem {
  id: string;
  title: string;
  category: 'Quran Recitation' | 'Sahih Hadith' | 'Tafsir' | 'Islamic Lecture' | 'Dua & Azkar' | 'Ramadan Special' | 'Ruqyah' | 'Barakah' | 'Shifa' | 'Gratitude' | 'Knowledge' | 'Family' | 'Character' | 'Mental Peace' | 'Repentance' | 'Social Rights' | string;
  reciterOrScholar: string;
  startTime: string; // "HH:MM" 24h
  endTime: string;   // "HH:MM" 24h
  dayOfWeek?: number; // 0=Sunday, 1=Monday ... 6=Saturday (undefined = daily)
  recurrenceType: 'DAILY' | 'WEEKLY' | 'RAMADAN' | 'SPECIAL_EVENT';
  audioStreamUrl: string;
  backupStreamUrl: string;
  isPrayerTimeOverride?: boolean;
  arabicVerseOrDhikr?: string;
  bengaliPronunciation?: string;
  bengaliMeaning?: string;
  seriesTag?: string;
  realLifeActionBn?: string;
  languageFormat?: 'ARABIC_AND_BANGLA' | 'BANGLA_ONLY' | 'ARABIC_ONLY';
  hasBanglaTranslation?: boolean;
}

export interface StreamStatus {
  isLive: boolean;
  activeItem: MediaScheduleItem;
  nextItem: MediaScheduleItem;
  isPrayerPause: boolean;
  prayerName?: string;
  usingBackupStream: boolean;
  playbackSource: string;
  timeRemainingMinutes?: number;
}

// 1. Azan Audio Tracks
export const AZAN_AUDIO_TRACKS = {
  generalAzan: {
    title: 'পবিত্র মক্কার সুমধুর আজান (Makkah Adhan)',
    url: 'https://download.quranicaudio.com/adhan/makkah.mp3',
    backupUrl: 'https://media.blubrry.com/muslim_central_adhan/content.blubrry.com/muslim_central_adhan/Makkah_Adhan.mp3'
  },
  fajrAzan: {
    title: 'পবিত্র মদিনার সুমধুর ফজর আজান (Madinah Fajr Adhan)',
    url: 'https://download.quranicaudio.com/adhan/madinah.mp3',
    backupUrl: 'https://media.blubrry.com/muslim_central_adhan/content.blubrry.com/muslim_central_adhan/Madinah_Fajr_Adhan.mp3'
  },
  azanDua: {
    title: 'আজান পরবর্তী মাসনূন দোয়া (Dua After Adhan)',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    bangla: 'আল্লাহুম্মা রাব্বা হাযিহিদ দাওয়াতিত তাম্মাহ, ওয়াস সালাতিল ক্বা-য়িমাহ, আ-তি মুহাম্মাদানিল ওয়াসীলাতা ওয়াল ফাদীলাহ, ওয়াব\'আসহু মাক্বামাম মাহমূদানিল্লাযী ওয়া\'আদতাহ।'
  }
};

export const DEFAULT_247_SCHEDULE: MediaScheduleItem[] = [
  {
    id: 'sch-01',
    title: 'তাহাজ্জুদ ও গভীর রাতের প্রশান্তি - সূরা আল-বাকারা ও রুকাইয়া',
    category: 'Quran Recitation',
    reciterOrScholar: 'শায়েখ মিশারী রশিদ আল-আফাসী',
    startTime: '00:00',
    endTime: '04:00',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/2.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/002.mp3',
    arabicVerseOrDhikr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ',
    bengaliPronunciation: 'বিসমিল্লাহির রাহমানির রাহিম • আল্লা-হু লা ইলা-হা ইল্লা হুওয়াল হাইয়্যুল ক্বাইয়্যুম',
    bengaliMeaning: 'আল্লাহ! তিনি ছাড়া আর কোনো উপাস্য নেই, তিনি চিরঞ্জীব, সর্বসত্তার ধারক।',
    realLifeActionBn: 'রাতের শেষ তৃতীয়াংশে তাহাজ্জুদ আদায় করুন এবং ঘরে সূরা বাকারা তিলাওয়াত শুনুন।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-02',
    title: 'ফজর পূর্ব ও সুবহে সাদিকের তিলাওয়াত - সূরা আস-সাজদাহ ও আল-ইনসান',
    category: 'Quran Recitation',
    reciterOrScholar: 'শায়েখ আবদুর রহমান আস-সুদাইস',
    startTime: '04:00',
    endTime: '05:30',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/32.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/032.mp3',
    arabicVerseOrDhikr: 'تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ يَدْعُونَ رَبَّهُمْ خَوْفًا وَطَمَعًا',
    bengaliPronunciation: 'তাতাজা-ফা জুনূবুহুম আনিল মাদ্বাজি’ই ইয়াদ’ঊনা রাব্বাহুম খাওফাওঁ ওয়া তামা’আ',
    bengaliMeaning: 'তাদের পার্শ্বসমূহ শয্যা হতে আলাদা থাকে, তারা তাদের রবকে ডাকে ভয় ও আশার সাথে।',
    realLifeActionBn: 'ফজরের সালাত জামাআতে আদায়ের জন্য প্রস্তুতি নিন এবং সুবহে সাদিকের দোয়া পড়ুন।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-03',
    title: 'ফজর উত্তর সহীহ বুখারী পাঠ ও সকালের মাসনুন আজকার',
    category: 'Sahih Hadith',
    reciterOrScholar: 'ড. আবু বকর মুহাম্মাদ জাকারিয়া',
    startTime: '05:30',
    endTime: '07:00',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/001.mp3',
    arabicVerseOrDhikr: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    bengaliPronunciation: 'আসবাহনা ওয়া আসবাহাল মুলকু লিল্লাহি ওয়াল হামদুলিল্লাহ',
    bengaliMeaning: 'আমরা সকালে উপনীত হয়েছি এবং সকল রাজত্ব আল্লাহর জন্য, আর সকল প্রশংসা আল্লাহর।',
    realLifeActionBn: 'সকালে ১০০ বার সুবহানাল্লাহি ওয়া বিহামদিহি পাঠ করুন ও হাদিসের শিক্ষায় দিন শুরু করুন।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-04',
    title: 'সূর্যোদয় ও চাশত - সূরা আর-রহমান ও বরকতময় রিজিকের আমল',
    category: 'Quran Recitation',
    reciterOrScholar: 'ক্বারী আব্দুল বাসিত আব্দুস সামাদ',
    startTime: '07:00',
    endTime: '09:00',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/55.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/055.mp3',
    arabicVerseOrDhikr: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    bengaliPronunciation: 'ফাবিআইয়্যি আ-লা-ই রাব্বিকুমা তুকায়্যিবান',
    bengaliMeaning: 'অতএব তোমরা উভয়ে তোমাদের রবের কোন কোন নিয়ামতকে অস্বীকার করবে?',
    realLifeActionBn: 'সূর্যোদয়ের ১৫ মিনিট পর সালাতুদ দুহা (চাশতের নামাজ) আদায় করুন।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-05',
    title: 'কর্মব্যস্ত দিনের প্রারম্ভে সহীহ মুসলিম ও তাফসীরুল কুরআন',
    category: 'Tafsir',
    reciterOrScholar: 'শায়েখ আহমেদ তৌফিক',
    startTime: '09:00',
    endTime: '12:00',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/36.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/036.mp3',
    arabicVerseOrDhikr: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    bengaliPronunciation: 'রাব্বানা আতিনা ফিদ্দুনিয়া হাসানাতাও ওয়া ফিল আখিরাতি হাসানাতাও ওয়াক্বিনা আজাবান নার',
    bengaliMeaning: 'হে আমাদের রব! আমাদের দুনিয়া ও আখেরাতে কল্যাণ দিন এবং জাহান্নাম থেকে বাঁচান।',
    realLifeActionBn: 'কর্মক্ষেত্রে সততা বজায় রাখুন ও হালাল উপার্জনের নিয়ত করুন।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-06',
    title: 'যোহর পূর্ব প্রস্তুতি ও সালাতের ফজিলত',
    category: 'Islamic Lecture',
    reciterOrScholar: 'ড. মিজানুর রহমান আল-আজহারী',
    startTime: '12:00',
    endTime: '13:30',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/62.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/062.mp3',
    arabicVerseOrDhikr: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوُقُوتًا',
    bengaliPronunciation: 'ইন্নাস সালাতা কানাত আল্যাল মুমিনিনা কিতাবাম মাওকুতা',
    bengaliMeaning: 'নিশ্চয়ই নির্ধারিত সময়ে সালাত আদায় করা মুমিনদের ওপর ফরয করা হয়েছে।',
    realLifeActionBn: 'আযানের সাথে সাথে সকল কাজ স্থগিত রেখে যোহরের সালাত আদায় করুন।',
    languageFormat: 'BANGLA_ONLY',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-07',
    title: 'যোহর পরবর্তী পারিবারিক জীবন, আদব ও আখলাক শিক্ষা',
    category: 'Family',
    reciterOrScholar: 'শায়েখ আহমাদুল্লাহ',
    startTime: '13:30',
    endTime: '15:30',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/49.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/049.mp3',
    arabicVerseOrDhikr: 'يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ',
    bengaliPronunciation: 'ইয়া আইয়্যুহাল্লাযীনা আমানূ লা ইয়াসখার ক্বাওমুম মিন ক্বাওম',
    bengaliMeaning: 'হে মুমিনগণ! কেউ যেন অপর কাউকে উপহাস না করে।',
    realLifeActionBn: 'পরিবার ও সহকর্মীদের সাথে উত্তম আচরণ ও সদাচরণ করুন।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-08',
    title: 'আসর পূর্ব কুরআন অধ্যয়ন ও আত্মশুদ্ধি - সূরা আল-কাহফ ও নূর',
    category: 'Quran Recitation',
    reciterOrScholar: 'শায়েখ মাহের আল-মুয়াইক্বিলী',
    startTime: '15:30',
    endTime: '17:00',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/18.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/018.mp3',
    arabicVerseOrDhikr: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ',
    bengaliPronunciation: 'আলহামদু লিল্লাহিল্লাযী আনযালা আলা আবদিহিল কিতাব',
    bengaliMeaning: 'সকল প্রশংসা আল্লাহর, যিনি তাঁর বান্দার ওপর কিতাব অবতীর্ণ করেছেন।',
    realLifeActionBn: 'আসরের পূর্বে ৪ রাকাত সুন্নাত সালাত আদায় করার চেষ্টা করুন।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-09',
    title: 'আসর উত্তর সন্ধ্যার মাসনুন দোয়া, ইস্তিগফার ও তাসবিহ',
    category: 'Dua & Azkar',
    reciterOrScholar: 'হাফেজ ক্বারী সাইফুল ইসলাম',
    startTime: '17:00',
    endTime: '18:30',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/113.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/113.mp3',
    arabicVerseOrDhikr: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    bengaliPronunciation: 'আমসাইনা ওয়া আমসাল মুলকু লিল্লাহি ওয়াল হামদুলিল্লাহ',
    bengaliMeaning: 'আমরা সন্ধ্যায় উপনীত হয়েছি এবং সমগ্র রাজত্ব আল্লাহর জন্য, আর সকল প্রশংসা আল্লাহর।',
    realLifeActionBn: 'সূর্যাস্তের পূর্বে সাইয়্যিদুল ইস্তিগফার ও সন্ধ্যার দোয়া পাঠ করুন।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-10',
    title: 'মাগরিব পরবর্তী সূরা আল-ওয়াকিয়াহ ও দারিদ্র্য মুক্তির আমল',
    category: 'Quran Recitation',
    reciterOrScholar: 'শায়েখ সাআদ আল-গামিদি',
    startTime: '18:30',
    endTime: '20:00',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/56.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/056.mp3',
    arabicVerseOrDhikr: 'إِذَا وَقَعَتِ الْوَاقِعَةُ • لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ',
    bengaliPronunciation: 'ইযা ওয়াক্বা’আতিল ওয়া-ক্বি’আহ • লাইসা লিওয়াক্ব’আতিহা কা-যিবাহ',
    bengaliMeaning: 'যখন কিয়ামত সংঘটিত হবে, তার সংঘটনকে অস্বীকার করার কেউ থাকবে না।',
    realLifeActionBn: 'মাগরিবের পর সূরা ওয়াকিয়াহ তিলাওয়াত করুন, হাদিসে বর্ণিত রয়েছে এতে অভাব দূর হয়।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-11',
    title: 'এশা পরবর্তী সিরাতুন্নবী (সা.) ও সাহাবাদের ঈমানদীপ্ত জীবন',
    category: 'Islamic Lecture',
    reciterOrScholar: 'ড. মনজুরে ইলাহী',
    startTime: '20:00',
    endTime: '21:30',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/48.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/048.mp3',
    arabicVerseOrDhikr: 'مُّحَمَّدٌ رَّسُولُ اللَّهِ وَالَّذِينَ مَعَهُ أَشِدَّاءُ عَلَى الْكُفَّارِ رُحَمَاءُ بَيْنَهُمْ',
    bengaliPronunciation: 'মুহাম্মাদুর রাসূলুল্লাহ, ওয়াল্লাযীনা মা’আহূ আশিদ্দা-উ আল্যাল কুফ্ফা-রি রুহামা-উ বাইনাহুম',
    bengaliMeaning: 'মুহাম্মাদ আল্লাহর রাসুল এবং তাঁর সাথীরা কাফিরদের প্রতি কঠোর ও পরস্পরের প্রতি সহানুভূতিশীল।',
    realLifeActionBn: 'দৈনন্দিন জীবনে রাসুলুল্লাহ (সা.)-এর সুন্নাহ অনুসরণ করুন।',
    languageFormat: 'BANGLA_ONLY',
    hasBanglaTranslation: true
  },
  {
    id: 'sch-12',
    title: 'রাতের প্রশান্তিময় তিলাওয়াত - সূরা আল-মুলক ও ৩ কুল (নিরাপত্তা ও কবরের আজাব থেকে মুক্তি)',
    category: 'Quran Recitation',
    reciterOrScholar: 'শায়েখ মিশারী রশিদ আল-আফاسى',
    startTime: '21:30',
    endTime: '23:59',
    recurrenceType: 'DAILY',
    audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/67.mp3',
    backupStreamUrl: 'https://server8.mp3quran.net/afs/067.mp3',
    arabicVerseOrDhikr: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    bengaliPronunciation: 'তাবারাকাল্লাযী বিইয়াদিহিল মুলকু ওয়া হুওয়া আলা কুল্লি শাইয়িন ক্বাদীর',
    bengaliMeaning: 'কল্যাণময় তিনি, যাঁর হাতে সর্বময় কর্তৃত্ব এবং তিনি সবকিছুর ওপর সর্বশক্তিমান।',
    realLifeActionBn: 'ঘুমানোর পূর্বে সূরা মুলক ও ৩ কুল পাঠ করে দুই হাতে ফুঁ দিয়ে শরীর মুছে ঘুমান।',
    languageFormat: 'ARABIC_AND_BANGLA',
    hasBanglaTranslation: true
  }
];

export class MediaEngineService {
  private schedule: MediaScheduleItem[];

  constructor() {
    this.schedule = this.loadPersistedSchedule();
  }

  private loadPersistedSchedule(): MediaScheduleItem[] {
    try {
      const saved = localStorage.getItem('islamic_custom_audio_schedule');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.log('Error loading custom audio schedule:', e);
    }
    return [...DEFAULT_247_SCHEDULE];
  }

  private saveSchedule() {
    try {
      localStorage.setItem('islamic_custom_audio_schedule', JSON.stringify(this.schedule));
    } catch (e) {
      console.log('Error saving custom audio schedule:', e);
    }
  }

  /**
   * Retrieves the current 24/7 broadcast item and next upcoming item
   * based on current wall clock time.
   */
  public getCurrentBroadcast(now = new Date()): StreamStatus {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    let activeIndex = this.schedule.findIndex(item => {
      const [sh, sm] = item.startTime.split(':').map(Number);
      const [eh, em] = item.endTime.split(':').map(Number);
      const startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;
      if (endMin === 0) endMin = 24 * 60;
      return currentMinutes >= startMin && currentMinutes < endMin;
    });

    if (activeIndex === -1) {
      activeIndex = 0;
    }

    const activeItem = this.schedule[activeIndex];
    const nextIndex = (activeIndex + 1) % this.schedule.length;
    const nextItem = this.schedule[nextIndex];

    const [eh, em] = activeItem.endTime.split(':').map(Number);
    let endMin = eh * 60 + em;
    if (endMin === 0) endMin = 24 * 60;
    const timeRemainingMinutes = Math.max(0, endMin - currentMinutes);

    return {
      isLive: true,
      activeItem,
      nextItem,
      isPrayerPause: false,
      usingBackupStream: false,
      playbackSource: activeItem.audioStreamUrl,
      timeRemainingMinutes
    };
  }

  public getSchedule(): MediaScheduleItem[] {
    return this.schedule;
  }

  public addScheduleItem(item: Omit<MediaScheduleItem, 'id'>): MediaScheduleItem {
    // Avoid duplicates by title and startTime
    const exists = this.schedule.some(s => s.title === item.title && s.startTime === item.startTime);
    if (exists) {
      return this.schedule.find(s => s.title === item.title)!;
    }

    const newItem: MediaScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`
    };
    this.schedule.push(newItem);
    this.saveSchedule();
    return newItem;
  }

  public deleteScheduleItem(id: string): boolean {
    const initialLen = this.schedule.length;
    this.schedule = this.schedule.filter(item => item.id !== id);
    if (this.schedule.length < initialLen) {
      this.saveSchedule();
      return true;
    }
    return false;
  }

  public resetToDefaultSchedule() {
    this.schedule = [...DEFAULT_247_SCHEDULE];
    this.saveSchedule();
  }
}
