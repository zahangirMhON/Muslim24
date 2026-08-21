import 'package:flutter/material.dart';

class MediaScreen extends StatelessWidget {
  const MediaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('২৪/৭ ইসলামিক মিডিয়া ও রেডিও')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFFBBF24).withOpacity(0.2),
                  border: Border.all(color: const Color(0xFFFBBF24), width: 3),
                ),
                child: const Icon(Icons.radio_rounded, size: 64, color: Color(0xFFFBBF24)),
              ),
              const SizedBox(height: 24),
              const Text('লাইভ ইসলামিক সম্প্রচার', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 8),
              const Text('লাইভ কুরআন তেলাওয়াত ও ইসলামিক আলোচনা', style: TextStyle(fontSize: 13, color: Colors.white70)),
              const SizedBox(height: 24),
              IconButton.filled(
                iconSize: 48,
                backgroundColor: const Color(0xFFFBBF24),
                icon: const Icon(Icons.play_arrow_rounded, color: Color(0xFF022C22)),
                onPressed: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }
}
