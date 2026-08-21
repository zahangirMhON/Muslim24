import 'package:flutter/material.dart';

class QuranScreen extends StatelessWidget {
  const QuranScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final surahs = [
      {'id': 1, 'name': 'সূরা আল-ফাতিহা', 'verses': 7, 'type': 'মক্কী'},
      {'id': 2, 'name': 'সূরা আল-বাকারা', 'verses': 286, 'type': 'মাদানী'},
      {'id': 3, 'name': 'সূরা আল-ইমরান', 'verses': 200, 'type': 'মাদানী'},
      {'id': 4, 'name': 'সূরা আন-নিসা', 'verses': 176, 'type': 'মাদানী'},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('পবিত্র আল-কুরআন')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: surahs.length,
        itemBuilder: (context, index) {
          final s = surahs[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: const Color(0xFFFBBF24),
                child: Text('${s['id']}', style: const TextStyle(color: Color(0xFF022C22), fontWeight: FontWeight.bold)),
              ),
              title: Text(s['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              subtitle: Text('${s['type']} • আয়াত: ${s['verses']}', style: const TextStyle(color: Colors.white70)),
              trailing: const Icon(Icons.play_circle_fill, color: Color(0xFFFBBF24)),
            ),
          );
        },
      ),
    );
  }
}
