export interface AsmaChallengeDay {
  dayNumber: number;
  asmaId: number;
  titleBn: string;
  actionTaskBn: string;
  reflectionPromptBn: string;
  habitTargetCount: number;
}

export interface AsmaChallenge {
  id: string;
  titleBn: string;
  subtitleBn: string;
  categoryBn: string;
  durationDays: number;
  badgeIcon: string;
  gradientClass: string;
  descriptionBn: string;
  days: AsmaChallengeDay[];
}

export const ASMA_CHALLENGES: AsmaChallenge[] = [
  {
    id: '21_day_rizq',
    titleBn: '২১ দিনের রিযিক ও বরকত কোর্স',
    subtitleBn: 'হালাল জীবিকা ও তাওয়াক্কুলের আত্মিক সাধনা',
    categoryBn: 'রিজিক ও সাহায্য',
    durationDays: 21,
    badgeIcon: '🌾',
    gradientClass: 'from-amber-600 via-amber-700 to-emerald-900',
    descriptionBn: 'আল্লাহর পবিত্র নামসমূহ (আর-রজ্জাক, আল-ওয়াহ্হাব, আল-ফাত্তাহ, আল-বাসিত)-এর মাধ্যমে তাওয়াক্কুল ও রিযিকের বরকত অর্জনের ২১ দিনের অভ্যাস পথযাত্রা।',
    days: [
      {
        dayNumber: 1,
        asmaId: 17, // Ar-Razzaq
        titleBn: 'দিন ১: পরম রিজিকদাতাকে চেনা',
        actionTaskBn: 'আজ উপার্জনের সময় সততা বজায় রাখুন এবং ১ জন সাহায্যপ্রার্থীকে খাবার দিন।',
        reflectionPromptBn: 'আমি কি মানুষের রিজিকের ওপর নির্ভর করছি নাকি প্রকৃত রিজিকদাতা আল্লাহর ওপর?',
        habitTargetCount: 33
      },
      {
        dayNumber: 2,
        asmaId: 16, // Al-Wahhab
        titleBn: 'দিন ২: অকৃপণ দানশীল আল্লাহর কাছে চাওয়া',
        actionTaskBn: 'আজ কোনো প্রতিদানের আশা না করে কাউকে গোপন কোনো সহায়তা প্রদান করুন।',
        reflectionPromptBn: 'আজকের গোপনে করা আমল আমাকে কতটা আল্লাহর খাস বান্দা অনুভব করায়?',
        habitTargetCount: 33
      },
      {
        dayNumber: 3,
        asmaId: 18, // Al-Fattah
        titleBn: "দিন ৩: বন্ধ দুয়ার খোলার দু'আ",
        actionTaskBn: "ফজর সালাতের পর আল-ফাত্তাহ স্মরণ করে দিনের শুভ সূচনা করুন।",
        reflectionPromptBn: 'জীবনের কোন কঠিন বন্ধ দরজা খুলতে আজ আল্লাহর দরবারে আকুল আবেদন করলাম?',
        habitTargetCount: 33
      },
      {
        dayNumber: 4,
        asmaId: 21, // Al-Basit
        titleBn: 'দিন ৪: প্রশস্ততা ও রিযিকের বিস্তার',
        actionTaskBn: 'চাশতের সালাত আদায় শেষে পরম প্রশস্ততাদানকারী আল্লাহর জিকির করুন।',
        reflectionPromptBn: 'আজকের জীবনে কোন প্রাচুর্য ও প্রশান্তির জন্য আলহামদুলিল্লাহ বললাম?',
        habitTargetCount: 33
      },
      {
        dayNumber: 5,
        asmaId: 88, // Al-Ghaniyyu
        titleBn: 'দিন ৫: অভাবমুক্ত ধনী সত্তা',
        actionTaskBn: 'নিজের যা আছে তাতেই সন্তুষ্ট থেকে মনে কোনো হিংসা বা হীনমন্যতা আসতে দেবেন না।',
        reflectionPromptBn: 'আজ কি আমি অন্যের নিয়ামত দেখে হিংসা না করে নিজের সন্তুষ্টি অনুভব করেছি?',
        habitTargetCount: 33
      },
      {
        dayNumber: 6,
        asmaId: 89, // Al-Mughni
        titleBn: 'দিন ৬: স্বাবলম্বী হওয়ার প্রেরণা',
        actionTaskBn: 'অলসতা ত্যাগ করে আজ নিজের কোনো জমে থাকা কাজ নিজে হাতে সম্পন্ন করুন।',
        reflectionPromptBn: 'আত্মনির্ভরশীল হতে আজ আমি কী নতুন পদক্ষেপ নিলাম?',
        habitTargetCount: 33
      },
      {
        dayNumber: 7,
        asmaId: 35, // Ash-Shakur
        titleBn: 'দিন ৭: নিয়ামতের শুকরিয়া আদায়',
        actionTaskBn: 'আজকের ৫টি ছোট-বড় নিয়ামতের তালিকা তৈরি করুন এবং আল্লাহর শুকরিয়া জ্ঞাপন করুন।',
        reflectionPromptBn: 'শুকরিয়া আদায় করলে নিয়ামত বৃদ্ধি পায়—আজ এটি কীভাবে অনুভব করলাম?',
        habitTargetCount: 33
      }
    ]
  },
  {
    id: '7_day_mercy',
    titleBn: '৭ দিনের রহমত ও ভালোবাসার অভ্যাস',
    subtitleBn: 'দয়া, ক্ষমা ও অন্তরের কোমলতা অর্জন',
    categoryBn: 'রহমত ও ক্ষমা',
    durationDays: 7,
    badgeIcon: '💚',
    gradientClass: 'from-emerald-600 via-teal-700 to-slate-900',
    descriptionBn: 'আর-রহমান, আর-রহীম, আল-ওয়াদূদ, আল-গফুর—এই নামগুলোর শিক্ষা দৈনন্দিন জীবনে প্রয়োগ করে অন্তরকে হিংসা ও কঠোরতা মুক্ত করার কোর্স।',
    days: [
      {
        dayNumber: 1,
        asmaId: 1, // Ar-Rahman
        titleBn: 'দিন ১: সৃষ্টির প্রতি দয়াশীল হওয়া',
        actionTaskBn: 'আজ আপনার অধীনস্ত বা ছোট কারো প্রতি অসীম দয়া ও ভালোবাসা প্রদর্শন করুন।',
        reflectionPromptBn: 'আমি যখন দয়া করি, তখন আল্লাহর রহমত কীভাবে অনুভব করি?',
        habitTargetCount: 33
      },
      {
        dayNumber: 2,
        asmaId: 2, // Ar-Rahim
        titleBn: 'দিন ২: বিশেষ মেহেরবানি ও ক্ষমা',
        actionTaskBn: 'আজ কারো করা কোনো পুরোনো ভুল ক্ষমা করে মন হালকা করে ফেলুন।',
        reflectionPromptBn: 'আজ কাকে ক্ষমা করলাম এবং মন কতটা শান্ত অনুভব করছে?',
        habitTargetCount: 33
      },
      {
        dayNumber: 3,
        asmaId: 47, // Al-Wadud
        titleBn: 'দিন ৩: ভালোবাসা ছড়ানো',
        actionTaskBn: 'পরিবারের সদস্যদের মিষ্টি কথায় প্রশংসা করুন ও তাদের উপহার দিন।',
        reflectionPromptBn: 'ভালোবাসা ও আন্তরিকতার মাধ্যমে আজ সম্পর্কের কেমন পরিবর্তন হলো?',
        habitTargetCount: 33
      },
      {
        dayNumber: 4,
        asmaId: 14, // Al-Ghaffar
        titleBn: 'দিন ৪: পাপ গোপন রাখা ও মাফ করা',
        actionTaskBn: 'অন্যের গোপন ত্রুটি দেখে তা কাউকে না বলে মনে গোপন রাখুন।',
        reflectionPromptBn: 'আল্লাহ যেমন আমার দোষ ঢেকে রেখেছেন, আমিও কি আজ তা করতে পেরেছি?',
        habitTargetCount: 33
      },
      {
        dayNumber: 5,
        asmaId: 80, // At-Tawwab
        titleBn: 'দিন ৫: সচ্চরিত্র নিয়ে তওবা করা',
        actionTaskBn: 'আজ খাঁটি দিলে ২ রাকাত সালাতুত তওবা পড়ে আল্লাহর কাছে ক্ষমা চান।',
        reflectionPromptBn: 'তওবার পর মনের ভেতর হালকা অনুভব করার অনুভূতি কেমন ছিল?',
        habitTargetCount: 33
      },
      {
        dayNumber: 6,
        asmaId: 82, // Al-Afuww
        titleBn: 'দিন ৬: চরম ক্ষমাপরায়ণতা',
        actionTaskBn: 'যে ব্যক্তি অন্যায় করেছে তার জন্য বদদোয়া না করে হেদায়েতের জন্য দোয়া করুন।',
        reflectionPromptBn: 'শত্রুর জন্যও হেদায়েত চাওয়া কি নববী সুন্নাত নয়?',
        habitTargetCount: 33
      },
      {
        dayNumber: 7,
        asmaId: 83, // Ar-Rauf
        titleBn: 'দিন ৭: পরম স্নৈহশীলতা',
        actionTaskBn: 'আজ বয়স্ক ব্যক্তি বা শিশুদের প্রতি বিশেষ মনোযোগ দিয়ে সময় দিন।',
        reflectionPromptBn: 'স্নৈহশীল আচরণের মাধ্যমে আজ কীভাবে ভালোবাসার প্রসার ঘটলো?',
        habitTargetCount: 33
      }
    ]
  },
  {
    id: '7_day_protection',
    titleBn: '৭ দিনের নিরাপত্তা ও তাওয়াক্কুল আমল',
    subtitleBn: 'ভয়ভীতি, অপশক্তি ও দুশ্চিন্তা থেকে সুরক্ষার আত্মরক্ষা',
    categoryBn: 'শক্তি ও আধিপত্য',
    durationDays: 7,
    badgeIcon: '🛡️',
    gradientClass: 'from-blue-700 via-indigo-800 to-slate-950',
    descriptionBn: "আল-হাফীজ, আল-ওয়াকীল, আস-সালাম, আল-মু'মিন—এই নামগুলোর সাহায্যে আল্লাহর ওপর ভরসা ও নিরাপত্তা হাসিলের ৭ দিনের আমল।",
    days: [
      {
        dayNumber: 1,
        asmaId: 38, // Al-Hafiz
        titleBn: 'দিন ১: মহা হেফাজতকারীর আশ্রয়ে',
        actionTaskBn: 'আজ ঘর থেকে বের হওয়ার সময় ও ঘুমানোর পূর্বে নিরাপত্তার দোয়া পাঠ করুন।',
        reflectionPromptBn: 'আল্লাহর হেফাজতের অনুভূতির সামনে দুনিয়ার ভয় কতটা তুচ্ছ?',
        habitTargetCount: 33
      },
      {
        dayNumber: 2,
        asmaId: 52, // Al-Wakil
        titleBn: 'দিন ২: সর্বোত্তম কর্মবিধায়ক',
        actionTaskBn: "যেকোনো উদ্বেগের কাজে 'হাসবুনাল্লাহু ওয়া নি'মাল ওয়াকীল' হৃদয় থেকে বলুন।",
        reflectionPromptBn: 'আজকের উদ্বেগ বা চিন্তা কীভাবে আল্লাহর কাছে সঁপে দিলাম?',
        habitTargetCount: 33
      },
      {
        dayNumber: 3,
        asmaId: 5, // As-Salam
        titleBn: 'দিন ৩: মানসিক ও শারীরিক নিরাপত্তা',
        actionTaskBn: 'অসুস্থ কোনো নিকটাত্মীয়ের খবর নিন ও তার জন্য শিফার দোয়া করুন।',
        reflectionPromptBn: 'সুস্থতা যে আল্লাহর দেওয়া কত বড় শান্তি তা আজ উপলব্ধি করেছি কি?',
        habitTargetCount: 33
      },
      {
        dayNumber: 4,
        asmaId: 6, // Al-Mu'min
        titleBn: 'দিন ৪: আমানতদারিতা ও ভয় মুক্তি',
        actionTaskBn: 'কথা ও কাজে আমানত রক্ষা করুন যাতে অন্যরা আপনার কাছে নিরাপদ বোধ করে।',
        reflectionPromptBn: 'আমার আচরণে আজ কেউ কষ্ট বা ভয় পেয়েছে কি না?',
        habitTargetCount: 33
      },
      {
        dayNumber: 5,
        asmaId: 7, // Al-Muhaymin
        titleBn: 'দিন ৫: সার্বক্ষণিক তদারকি',
        actionTaskBn: 'গোপনে বা প্রকাশ্যে গুনাহ বর্জন করে আল্লাহর সার্বক্ষণিক নজরদারি স্মরণ করুন।',
        reflectionPromptBn: 'আল্লাহ আমাকে দেখছেন—এই অনুভূতির প্রভাব কেমন ছিল?',
        habitTargetCount: 33
      },
      {
        dayNumber: 6,
        asmaId: 53, // Al-Qawiyyu
        titleBn: 'দিন ৬: মহা শক্তিশালী আল্লাহর ভরসা',
        actionTaskBn: 'শারীরিক দুর্বলতা বা মানসিক হতাশার সময় আত্মবিশ্বাস বজায় রাখুন।',
        reflectionPromptBn: 'আল্লাহর শক্তি অসীম—এ বিশ্বাসে মন কতটা শক্ত হলো?',
        habitTargetCount: 33
      },
      {
        dayNumber: 7,
        asmaId: 54, // Al-Matin
        titleBn: 'দিন ৭: সুদৃঢ় ইমানের ওপর অবিচল',
        actionTaskBn: 'আজ দ্বীনের ওপর অবিচল থাকার জন্য ২ রাকাত নফল সালাতে বিশেষ দোয়া করুন।',
        reflectionPromptBn: 'দ্বীনের ওপর অবিচল থাকা আমার জীবনের প্রধান লক্ষ্য কি না?',
        habitTargetCount: 33
      }
    ]
  }
];
