import 'package:flutter/material.dart';
import '../features/home/presentation/screens/home_screen.dart';
import '../features/prayer/presentation/screens/prayer_screen.dart';
import '../features/quran/presentation/screens/quran_screen.dart';
import '../features/media/presentation/screens/media_screen.dart';
import '../features/more/presentation/screens/more_screen.dart';

class BottomNavScaffold extends StatefulWidget {
  const BottomNavScaffold({super.key});

  @override
  State<BottomNavScaffold> createState() => _BottomNavScaffoldState();
}

class _BottomNavScaffoldState extends State<BottomNavScaffold> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    PrayerScreen(),
    QuranScreen(),
    MediaScreen(),
    MoreScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFF022C22),
        selectedItemColor: const Color(0xFFFBBF24),
        unselectedItemColor: Colors.white60,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'হোম'),
          BottomNavigationBarItem(icon: Icon(Icons.access_time_filled_rounded), label: 'নামাজ'),
          BottomNavigationBarItem(icon: Icon(Icons.menu_book_rounded), label: 'কুরআন'),
          BottomNavigationBarItem(icon: Icon(Icons.radio_rounded), label: 'মিডিয়া'),
          BottomNavigationBarItem(icon: Icon(Icons.grid_view_rounded), label: 'আরও'),
        ],
      ),
    );
  }
}
