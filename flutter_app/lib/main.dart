import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/theme/app_theme.dart';
import 'core/localization/app_localizations.dart';
import 'features/auth/presentation/screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const IslamicLifeApp());
}

class IslamicLifeApp extends StatefulWidget {
  const IslamicLifeApp({super.key});

  @override
  State<IslamicLifeApp> createState() => _IslamicLifeAppState();
}

class _IslamicLifeAppState extends State<IslamicLifeApp> {
  ThemeMode _themeMode = ThemeMode.dark;
  Locale _locale = const Locale('bn');

  void toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  void changeLocale(Locale newLocale) {
    setState(() {
      _locale = newLocale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Islamic Life 24/7',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      locale: _locale,
      supportedLocales: const [
        Locale('bn'), // Bengali
        Locale('en'), // English
        Locale('ar'), // Arabic (RTL)
      ],
      localizationsDelegates: const [
        AppLocalizationsDelegate(),
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: const SplashScreen(),
    );
  }
}
