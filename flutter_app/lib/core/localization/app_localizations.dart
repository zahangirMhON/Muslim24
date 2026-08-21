import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const Map<String, Map<String, String>> _localizedValues = {
    'bn': {
      'appName': 'ইসলামিক লাইফ ২৪/৭',
      'tagline': 'আপনার বিশ্বস্ত ডিজিটাল ইসলামিক সঙ্গী',
      'home': 'হোম',
      'prayer': 'নামাজ',
      'quran': 'কুরআন',
      'media': 'মিডিয়া',
      'more': 'আরও',
      'settings': 'সেটিংস',
      'login': 'লগইন',
      'register': 'রেজিস্ট্রেশন',
      'aiTitle': 'ইসলামিক লাইফ AI',
      'qibla': 'কিবলা কম্পাস',
    },
    'en': {
      'appName': 'Islamic Life 24/7',
      'tagline': 'Your Trusted Digital Islamic Companion',
      'home': 'Home',
      'prayer': 'Prayer',
      'quran': 'Quran',
      'media': 'Media',
      'more': 'More',
      'settings': 'Settings',
      'login': 'Login',
      'register': 'Register',
      'aiTitle': 'Islamic Life AI',
      'qibla': 'Qibla Compass',
    },
    'ar': {
      'appName': 'الحياة الإسلامية ٢٤/٧',
      'tagline': 'رفيقك الرقمي الإسلامي الموثوق',
      'home': 'الرئيسية',
      'prayer': 'الصلاة',
      'quran': 'القرآن',
      'media': 'الإعلام',
      'more': 'المزيد',
      'settings': 'الإعدادات',
      'login': 'تسجيل الدخول',
      'register': 'إنشاء حساب',
      'aiTitle': 'الذكاء الاصطناعي الإسلامي',
      'qibla': 'قبلة الصلاة',
    },
  };

  String translate(String key) {
    return _localizedValues[locale.languageCode]?[key] ?? key;
  }
}

class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['bn', 'en', 'ar'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(AppLocalizationsDelegate old) => false;
}
