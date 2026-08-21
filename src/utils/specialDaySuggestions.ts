import { getTripleCalendarDates } from './bengaliUtils';
import { launchDhikrInTasbih } from './haptics';
import { toggleAmalCompletion, loadDayAmalState, getTodayDateString } from '../services/amalTrackerService';

export interface SpecialAmalItem {
  id: string;
  titleBn: string;
  subtitleBn: string;
  badgeBn: string;
  badgeColor: 'amber' | 'emerald' | 'teal' | 'rose' | 'indigo' | 'purple';
  category: 'prayer' | 'dua' | 'dhikr' | 'quran' | 'sunnah_nafel';
  arabicText?: string;
  transliterationBn?: string;
  meaningBn?: string;
  virtueBn: string;
  hadithSourceBn: string;
  recommendedTimeBn: string;
  targetCount?: number;
  actionType: 'tasbih' | 'quran' | 'toggle' | 'prayer';
  surahNumber?: number; // e.g. 18 for Surah Al-Kahf
}

export interface DaySuggestionsPayload {
  dayType: 'friday' | 'mon_thu' | 'white_days' | 'ramadan' | 'dhulhijjah' | 'muharram' | 'regular';
  dayHeadingBn: string;
  daySubHeadingBn: string;
  bannerBgClass: string;
  bannerBorderClass: string;
  icon: string;
  hijriDateInfoBn: string;
  items: SpecialAmalItem[];
}

/**
 * Returns dynamic suggested Amals and Dhikrs based on today's day of week & Islamic calendar
 */
export function getTodaySpecialAmalSuggestions(date: Date = new Date()): DaySuggestionsPayload {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const tripleDates = getTripleCalendarDates(date);
  const isFriday = dayOfWeek === 5;
  const isMonOrThu = dayOfWeek === 1 || dayOfWeek === 4;
  const isMuharram = tripleDates.hijriFormatted.includes('মুহররম') || tripleDates.hijriMonthPractice.includes('মুহররম');
  const isRamadan = tripleDates.hijriFormatted.includes('রমজান') || tripleDates.hijriMonthPractice.includes('রমজান');
  const isDhulHijjah = tripleDates.hijriFormatted.includes('জিলহজ') || tripleDates.hijriMonthPractice.includes('জিলহজ');

  // 1. SPECIAL FRIDAY (পবিত্র জুমু'আ বার)
  if (isFriday) {
    return {
      dayType: 'friday',
      dayHeadingBn: 'আজ পবিত্র জুমু\'আ বার — সপ্তাহের শ্রেষ্ঠ দিন (ইয়াউমুল জুমু\'আ)',
      daySubHeadingBn: 'জুমার দিনের বিশেষ ৫টি সুন্নাত, সূরা আল-কাহাফ, আসরের পর ৮০ বার দরূদ ও দোয়া কবুলের বিশেষ মুহূর্ত',
      bannerBgClass: 'from-amber-950/80 via-emerald-950/90 to-teal-950/80',
      bannerBorderClass: 'border-amber-400/60 ring-1 ring-amber-400/30',
      icon: '🕌',
      hijriDateInfoBn: `${tripleDates.hijriFormatted} • ${tripleDates.bengaliFormatted}`,
      items: [
        {
          id: 'amal-friday-durood-80',
          titleBn: 'আসরের পর ৮০ বার বিশেষ দরূদ শরীফ পাঠ',
          subtitleBn: '৮০ বছরের গুনাহ ক্ষমা ও ৮০ বছরের নফল ইবাদতের সওয়াব লাভ',
          badgeBn: '৮০ বার দরূদ',
          badgeColor: 'amber',
          category: 'dhikr',
          arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ وَعَلَى آلِهِ وَسَلِّمْ تَسْلِيمًا',
          transliterationBn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিনিন নাবিয়্যিল উম্মিয়্যি ওয়া আলা আলিহি ওয়া সাল্লিম তাসলিমা।',
          meaningBn: 'হে আল্লাহ! নিরক্ষর নবী মুহাম্মদ (সা.) এবং তাঁর পরিবার-পরিজনের প্রতি শান্তি ও রহমত বর্ষণ করুন।',
          virtueBn: 'যে ব্যক্তি জুমার দিন আসরের নামাজের পর ৮০ বার এই দরূদ পড়বে, আল্লাহ তার ৮০ বছরের গুনাহ ক্ষমা করবেন এবং ৮০ বছরের নফল ইবাদতের সওয়াব দান করবেন।',
          hadithSourceBn: 'সুনানে তিরমিযী, মুসনাদে আহমদ ও তাবারানী',
          recommendedTimeBn: 'জুমার দিন আসরের নামাজের পর থেকে সূর্যাস্ত পর্যন্ত',
          targetCount: 80,
          actionType: 'tasbih'
        },
        {
          id: 'amal-friday-kahf',
          titleBn: 'সূরা আল-কাহাফ (সম্পূর্ণ অথবা প্রথম ও শেষ ১০ আয়াত) তিলাওয়াত',
          subtitleBn: 'এক জুমা থেকে অন্য জুমা পর্যন্ত নূর ও দাজ্জালের ফেতনা থেকে নিরাপত্তা',
          badgeBn: 'সূরা আল-কাহাফ',
          badgeColor: 'emerald',
          category: 'quran',
          virtueBn: 'যে ব্যক্তি জুমার দিনে সূরা আল-কাহাফ তিলাওয়াত করবে, তার জন্য এক জুমা থেকে অপর জুমা পর্যন্ত বিশেষ নূর প্রজ্বলিত থাকবে এবং দাজ্জালের ফেতনা থেকে সে হেফাজতে থাকবে।',
          hadithSourceBn: 'সুনানে নাসাঈ, বায়হাকী, সহীহ আল-জামে: ৬৪৭০',
          recommendedTimeBn: 'বৃহস্পতিবার সূর্যাস্ত থেকে শুক্রবার সূর্যাস্ত পর্যন্ত যেকোনো সময়',
          actionType: 'quran',
          surahNumber: 18
        },
        {
          id: 'amal-friday-sunnah-ghusl',
          titleBn: 'জুমার দিনের ৫টি সুন্নাত: গোসল, সুগন্ধি, উত্তম পোশাক ও মেসওয়াক',
          subtitleBn: 'শারীরিক পরিচ্ছন্নতা ও জুমার বিশেষ প্রস্তুতি',
          badgeBn: 'জুমার ৫ সুন্নাত',
          badgeColor: 'teal',
          category: 'sunnah_nafel',
          virtueBn: 'যে ব্যক্তি জুমার দিন উত্তমরূপে গোসল করে, উত্তম পোশাক পরে, আতর বা সুগন্ধি ব্যবহার করে এবং আগে আগে মসজিদে যায়, তার বিগত এক সপ্তাহের সগীরা গুনাহ ক্ষমা করে দেওয়া হয়।',
          hadithSourceBn: 'সহীহ বুখারী: ৮৮৩, সহীহ মুসলিম: ৮৫৭',
          recommendedTimeBn: 'জুমার নামাজে যাওয়ার পূর্বে',
          actionType: 'toggle'
        },
        {
          id: 'amal-friday-dua-asrijabah',
          titleBn: 'আসরের পর সা\'আতুল ইজাবাহ (দোয়া কবুলের বিশেষ মুহূর্ত)-এ মুনাজাত',
          subtitleBn: 'জুমার দিনের এমন এক মুহূর্ত যখন কোনো দোয়া ফেরত দেওয়া হয় না',
          badgeBn: 'দোয়া কবুলের মুহূর্ত',
          badgeColor: 'purple',
          category: 'dua',
          arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
          transliterationBn: 'রব্বানা আতিনা ফিদ দুনিয়া হাসানাতাওঁ ওয়া ফিল আখিরাতি হাসানাতাওঁ ওয়া কিনা আজাবান নার।',
          meaningBn: 'হে আমাদের পালনকর্তা! আমাদের দুনিয়াতে কল্যাণ দান করুন এবং আখিরাতেও কল্যাণ দান করুন এবং আমাদেরকে জাহান্নামের আজাব থেকে রক্ষা করুন।',
          virtueBn: 'রাসূলুল্লাহ (সা.) বলেছেন: জুমার দিনে এমন একটি সময় আছে, যে সময় কোনো মুসলিম বান্দা আল্লাহর কাছে কোনো কল্যাণ চাইলে আল্লাহ তাকে তা অবশ্যই দান করেন (আসরের শেষ ভাগে)।',
          hadithSourceBn: 'সহীহ বুখারী: ৯৩৫, সহীহ মুসলিম: ৮৫২',
          recommendedTimeBn: 'জুমার দিন আসর পরবর্তী সময় থেকে সূর্যাস্ত (মাগরিব) পর্যন্ত',
          actionType: 'toggle'
        },
        {
          id: 'amal-salah-dhuhr',
          titleBn: 'জুমু\'আর সালাত আদায় (খুতবা শ্রবণ, ২ রাকাত ফরজ ও সুন্নাতসহ)',
          subtitleBn: 'সপ্তাহের শ্রেষ্ঠ জামায়াত ও ফরজে আইন সালাত',
          badgeBn: 'জুমু\'আ সালাত',
          badgeColor: 'indigo',
          category: 'prayer',
          virtueBn: 'যে ব্যক্তি মনোযোগ দিয়ে জুমার খুতবা শোনে এবং দুই রাকাত ফরজ সালাত আদায় করে, তার দুই জুমার মধ্যবর্তী সময়ের সমস্ত গুনাহ মাফ করে দেওয়া হয়।',
          hadithSourceBn: 'সহীহ মুসলিম: ৮৫৭',
          recommendedTimeBn: 'দুপুরে সূর্য হেলে পড়ার পর প্রথম জামায়াতে',
          actionType: 'prayer'
        }
      ]
    };
  }

  // 2. MONDAY & THURSDAY (সোম ও বৃহস্পতিবারের সুন্নাত নফল সিয়াম)
  if (isMonOrThu) {
    const dayName = dayOfWeek === 1 ? 'সোমবার' : 'বৃহস্পতিবার';
    return {
      dayType: 'mon_thu',
      dayHeadingBn: `আজ ${dayName} — সুন্নাত নফল রোজা ও বিশেষ আমলের দিন`,
      daySubHeadingBn: 'সোম ও বৃহস্পতিবার বান্দার আমলসমূহ আল্লাহর দরবারে পেশ করা হয়',
      bannerBgClass: 'from-teal-950/80 via-emerald-950/90 to-slate-950/80',
      bannerBorderClass: 'border-teal-400/60 ring-1 ring-teal-400/30',
      icon: '🌿',
      hijriDateInfoBn: `${tripleDates.hijriFormatted} • ${tripleDates.bengaliFormatted}`,
      items: [
        {
          id: 'amal-sunnah-fast-mon-thu',
          titleBn: `${dayName}ের সুন্নাত নফল সিয়াম (রোজা)`,
          subtitleBn: 'রাসূলুল্লাহ (সা.) এই দিনগুলোতে রোজা রাখতেন',
          badgeBn: 'সুন্নাত রোজা',
          badgeColor: 'teal',
          category: 'sunnah_nafel',
          virtueBn: 'রাসূলুল্লাহ (সা.) বলেছেন: সোম ও বৃহস্পতিবার আল্লাহর নিকট বান্দার আমলসমূহ পেশ করা হয়। অতএব আমি পছন্দ করি যে, আমার আমল যখন পেশ করা হবে তখন যেন আমি রোজা অবস্থায় থাকি।',
          hadithSourceBn: 'সুনানে তিরমিযী: ৭৪৭, সুনানে নাসাঈ: ২৩৫৮',
          recommendedTimeBn: 'সুবহে সাদিক হতে সূর্যাস্ত পর্যন্ত',
          actionType: 'toggle'
        },
        {
          id: 'amal-dhikr-istighfar',
          titleBn: '১০০ বার সাইয়্যিদুল ইস্তিগফার ও তওবা',
          subtitleBn: 'আমলনামা নিষ্পাপ ও পবিত্র করার সর্বোত্তম দোয়া',
          badgeBn: '১০০ বার ইস্তিগফার',
          badgeColor: 'amber',
          category: 'dhikr',
          arabicText: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
          transliterationBn: 'আস্তাগফিরুল্লাহাল আজীমাল্লাযী লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল কাইয়্যুমু ওয়া আতূবু ইলাইহি।',
          meaningBn: 'আমি মহান আল্লাহর নিকট ক্ষমা প্রার্থনা করছি যিনি ব্যতীত কোনো সত্য উপাস্য নেই, তিনি চিরঞ্জীব, সর্বসত্তার ধারক এবং আমি তাঁরই নিকট তাওবা করছি।',
          virtueBn: 'যে ব্যক্তি এই ইস্তিগফার পাঠ করবে, সে রণক্ষেত্র থেকে পলায়ন করার মতো কবিরা গুনাহ করলেও তাকে ক্ষমা করে দেওয়া হবে।',
          hadithSourceBn: 'সুনান আবু দাউদ: ১৫১৭, তিরমিযী: ৩৫৭৭',
          recommendedTimeBn: 'সারাদিনে অবসরে ও আসর নামাজের পর',
          targetCount: 100,
          actionType: 'tasbih'
        },
        {
          id: 'amal-dhikr-durood',
          titleBn: '১০০ বার দরূদ শরীফ (সাল্লাল্লাহু আলা মুহাম্মাদ)',
          subtitleBn: 'রাসূলুল্লাহ (সা.)-এর প্রতি ভালোবাসার বহিঃপ্রকাশ ও শাফায়াত লাভ',
          badgeBn: '১০০ বার দরূদ',
          badgeColor: 'emerald',
          category: 'dhikr',
          arabicText: 'صَلَّى اللَّهُ عَلَى مُحَمَّدٍ',
          transliterationBn: 'সাল্লাল্লাহু আলা মুহাম্মাদ।',
          meaningBn: 'আল্লাহ তাআলা হযরত মুহাম্মদ (সা.)-এর ওপর রহমত ও শান্তি বর্ষণ করুন।',
          virtueBn: 'যে ব্যক্তি রাসূলুল্লাহ (সা.)-এর ওপর একবার দরূদ পড়ে, আল্লাহ তার ওপর ১০টি রহমত নাযিল করেন ও ১০টি পাপ মোচন করেন।',
          hadithSourceBn: 'সহীহ মুসলিম: ৪০৮',
          recommendedTimeBn: 'সারাদিনে অবসরে',
          targetCount: 100,
          actionType: 'tasbih'
        }
      ]
    };
  }

  // 3. SPECIAL ISLAMIC MONTH: MUHARRAM (পবিত্র মুহররম ও আশুরা)
  if (isMuharram) {
    return {
      dayType: 'muharram',
      dayHeadingBn: 'পবিত্র মুহররম মাস — আশহুরে হুরুমের সম্মানিত দিনসমূহ',
      daySubHeadingBn: 'রমজানের পর শ্রেষ্ঠ নফল রোজা ও আশুরার (১০ই মুহররম) বিশেষ ফজিলতপূর্ণ আমল',
      bannerBgClass: 'from-slate-950 via-emerald-950 to-teal-950',
      bannerBorderClass: 'border-emerald-500/60 ring-1 ring-emerald-500/30',
      icon: '🌙',
      hijriDateInfoBn: `${tripleDates.hijriFormatted} • ${tripleDates.bengaliFormatted}`,
      items: [
        {
          id: 'amal-muharram-ashura',
          titleBn: 'মুহররমের নফল রোজা (বিশেষত ৯ ও ১০ অথবা ১০ ও ১১ই মুহররম)',
          subtitleBn: '১টি রোজায় বিগত ১ বছরের সমস্ত সগীরা গুনাহ মাফ',
          badgeBn: 'আশুরার রোজা',
          badgeColor: 'emerald',
          category: 'sunnah_nafel',
          virtueBn: 'রাসূলুল্লাহ (সা.) ইরশাদ করেন: "রমজানের পর সর্বোত্তম রোজা হলো আল্লাহর পবিত্র মাস মুহররমের রোজা" (সহীহ মুসলিম)। আশুরার ১টি রোজা বিগত ১ বছরের গুনাহ ক্ষমা করে দেয়।',
          hadithSourceBn: 'সহীহ মুসলিম: ১১৬৩, সুনানে তিরমিযী: ৭৫২',
          recommendedTimeBn: 'মুহররম মাসের যেকোনো দিন, বিশেষ করে ৯ ও ১০ই মুহররম',
          actionType: 'toggle'
        },
        {
          id: 'amal-dhikr-subhanallah',
          titleBn: '১০০ বার সুবহানাল্লাহি ওয়া বিহামদিহী, সুবহানাল্লাহিল আজীম',
          subtitleBn: 'মিজানের পাল্লায় অত্যন্ত ভারী ও প্রিয় তাসবিহ',
          badgeBn: '১০০ বার তাসবিহ',
          badgeColor: 'amber',
          category: 'dhikr',
          arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
          transliterationBn: 'সুবহানাল্লাহি ওয়া বিহামদিহী সুবহানাল্লাহিল আজীম।',
          meaningBn: 'আল্লাহর প্রশংসাসহ তাঁর পবিত্রতা ঘোষণা করছি, মহান আল্লাহ অতি পবিত্র।',
          virtueBn: 'দুটো বাক্য মুখে উচ্চারণে সহজ, মিজানের পাল্লায় অত্যন্ত ভারী এবং দয়াময় আল্লাহর নিকট অত্যন্ত প্রিয় (সহীহ বুখারী)।',
          hadithSourceBn: 'সহীহ বুখারী: ৬৬৮২, সহীহ মুসলিম: ২৬৯৪',
          recommendedTimeBn: 'সকালে বা সন্ধ্যায়',
          targetCount: 100,
          actionType: 'tasbih'
        }
      ]
    };
  }

  // 4. REGULAR DAILY ISLAMIC SUGGESTIONS (প্রতিদিনের বরকতময় আমলসমূহ)
  return {
    dayType: 'regular',
    dayHeadingBn: 'আজকের বরকতময় আমল ও জিকির নির্দেশিকা',
    daySubHeadingBn: '৫ ওয়াক্ত সালাত, সকাল-সন্ধ্যার আজকার, কুরআন তিলাওয়াত ও মাসনূন জিকির',
    bannerBgClass: 'from-slate-950 via-teal-950 to-emerald-950',
    bannerBorderClass: 'border-white/15',
    icon: '✨',
    hijriDateInfoBn: `${tripleDates.hijriFormatted} • ${tripleDates.bengaliFormatted}`,
    items: [
      {
        id: 'amal-quran-daily',
        titleBn: 'দৈনিক অন্তত ১০ আয়াত বা ১ রুকু অর্থসহ তিলাওয়াত',
        subtitleBn: 'কুরআনের সাথে দৈনিক সম্পর্ক বজায় রাখা',
        badgeBn: 'কুরআন তিলাওয়াত',
        badgeColor: 'emerald',
        category: 'quran',
        virtueBn: 'কুরআনের প্রতিটি হরফে ১০টি করে নেকি লিপিবদ্ধ হয়। যে ব্যক্তি নিয়মিত কুরআন পড়বে, কিয়ামতের দিন কুরআন তার জন্য সুপারিশ করবে।',
        hadithSourceBn: 'সুনানে তিরমিযী: ২৯১০, সহীহ মুসলিম: ৮০৪',
        recommendedTimeBn: 'ফজরের পর বা ঘুমানোর পূর্বে',
        actionType: 'toggle'
      },
      {
        id: 'amal-dhikr-subhanallah',
        titleBn: '১০০ বার সুবহানাল্লাহি ওয়া বিহামদিহী',
        subtitleBn: 'সমুদ্রের ফেনা পরিমাণ গুনাহ মাফের শ্রেষ্ঠ আমল',
        badgeBn: '১০০ বার জিকির',
        badgeColor: 'amber',
        category: 'dhikr',
        arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        transliterationBn: 'সুবহানাল্লাহি ওয়া বিহামদিহী।',
        meaningBn: 'আল্লাহর প্রশংসার সাথে তাঁর পবিত্রতা ঘোষণা করছি।',
        virtueBn: 'যে ব্যক্তি দিনে ১০০ বার এই তাসবিহ পাঠ করবে, তার সমুদ্রের ফেনা পরিমাণ গুনাহ থাকলেও তা ক্ষমা করে দেওয়া হবে।',
        hadithSourceBn: 'সহীহ বুখারী: ৬৪০৫, সহীহ মুসলিম: ২৬৯১',
        recommendedTimeBn: 'সকালে ও দিনে যেকোনো সময়',
        targetCount: 100,
        actionType: 'tasbih'
      },
      {
        id: 'amal-dhikr-istighfar',
        titleBn: '১০০ বার আস্তাগফিরুল্লাহ ও তওবা',
        subtitleBn: 'রিযিক বৃদ্ধি, দুশ্চিন্তা মুক্তি ও গোনাহ মোচন',
        badgeBn: '১০০ বার ইস্তিগফার',
        badgeColor: 'teal',
        category: 'dhikr',
        arabicText: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
        transliterationBn: 'আস্তাগফিরুল্লাহ ওয়া আতূবু ইলাইহি।',
        meaningBn: 'আমি আল্লাহর নিকট ক্ষমা প্রার্থনা করছি এবং তাঁরই দিকে প্রত্যাবর্তন করছি।',
        virtueBn: 'রাসূলুল্লাহ (সা.) নিষ্পাপ হওয়া সত্ত্বেও দৈনিক ১০০ বারের বেশি ইস্তিগফার করতেন।',
        hadithSourceBn: 'সহীহ মুসলিম: ২৭০২',
        recommendedTimeBn: 'সারাদিনে ও প্রতিটি সালাত শেষে',
        targetCount: 100,
        actionType: 'tasbih'
      },
      {
        id: 'amal-sunnah-sadaqah',
        titleBn: 'দৈনিক অন্তত একটি ভালো কাজ, সাদাকাহ বা পিতা-মাতার খেদমত',
        subtitleBn: 'দান-সাদাকাহ ও সদাচরণ বিপদমুক্তির উপায়',
        badgeBn: 'সাদাকাহ ও আমল',
        badgeColor: 'indigo',
        category: 'sunnah_nafel',
        virtueBn: 'সাদাকাহ মানুষের আয়ু বৃদ্ধি করে এবং অপমৃত্যু ও বালা-মুসিবত থেকে রক্ষা করে। মুচকি হাসি দেওয়াও একটি সাদাকাহ।',
        hadithSourceBn: 'সুনানে তিরমিযী: ৬৬৪',
        recommendedTimeBn: 'সারাদিনের যেকোনো সময়',
        actionType: 'toggle'
      }
    ]
  };
}
