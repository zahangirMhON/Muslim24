import 'package:flutter/material.dart';

class PrayerScreen extends StatelessWidget {
  const PrayerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final times = [
      {'name': 'ফজর', 'time': '০৪:১২ AM'},
      {'name': 'যোহর', 'time': '১২:০৮ PM'},
      {'name': 'আসর', 'time': '০৪:৩৫ PM'},
      {'name': 'মাগরিব', 'time': '০৬:৪৮ PM'},
      {'name': 'এশা', 'time': '০৮:১০ PM'},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('দৈনন্দিন নামাজের সময়সূচী (ঢাকা)')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: times.length,
        itemBuilder: (context, index) {
          final item = times[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const Icon(Icons.mosque, color: Color(0xFFFBBF24)),
              title: Text(item['name']!, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              trailing: Text(item['time']!, style: const TextStyle(fontSize: 16, color: Color(0xFFFBBF24), fontWeight: FontWeight.bold)),
            ),
          );
        },
      ),
    );
  }
}
