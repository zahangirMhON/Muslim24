import 'package:flutter/material.dart';

class AppTheme {
  // Emerald & Amber Brand Colors
  static const Color primaryEmerald = Color(0xFF064E3B); // emerald-900
  static const Color darkBackground = Color(0xFF022C22); // emerald-950
  static const Color goldAccent = Color(0xFFFBBF24); // amber-400
  static const Color cardDark = Color(0xFF065F46); // emerald-800
  static const Color lightBackground = Color(0xFFECFDF5); // emerald-50

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryEmerald,
        brightness: Brightness.light,
        primary: primaryEmerald,
        secondary: goldAccent,
        surface: Colors.white,
      ),
      scaffoldBackgroundColor: lightBackground,
      appBarTheme: const AppBarTheme(
        backgroundColor: primaryEmerald,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryEmerald,
        brightness: Brightness.dark,
        primary: goldAccent,
        secondary: primaryEmerald,
        surface: cardDark,
      ),
      scaffoldBackgroundColor: darkBackground,
      appBarTheme: const AppBarTheme(
        backgroundColor: darkBackground,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        color: const Color(0xFF064E3B).withOpacity(0.8),
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: Colors.emerald.shade700.withOpacity(0.5)),
        ),
      ),
    );
  }
}
