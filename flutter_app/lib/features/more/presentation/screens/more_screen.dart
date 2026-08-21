import 'package:flutter/material.dart';
import 'settings_screen.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      {'title': 'ডিজিটাল তাসবিহ কাউন্টার', 'icon': Icons.fingerprint},
      {'title': 'কিবলা কম্পাস', 'icon': Icons.explore},
      {'title': 'ইসলামিক কুইজ', 'icon': Icons.quiz},
      {'title': 'হিসনুল মুসলিম দোয়া ভাণ্ডার', 'icon': Icons.menu_book},
      {'title': 'সেটিংস', 'icon': Icons.settings},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('আরও ফিচার ও টুলস')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        itemBuilder: (context, index) {
          final item = items[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: Icon(item['icon'] as IconData, color: const Color(0xFFFBBF24)),
              title: Text(item['title'] as String, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.white38),
              onTap: () {
                if (item['title'] == 'সেটিংস') {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const SettingsScreen()),
                  );
                }
              },
            ),
          );
        },
      ),
    );
  }
}
