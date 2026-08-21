import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ইসলামিক লাইফ ২৪/৭'),
        actions: [
          IconButton(icon: const Icon(Icons.location_on), onPressed: () {}),
          IconButton(icon: const Icon(Icons.notifications_active), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Calendar Banner Card
            Card(
              color: const Color(0xFF064E3B),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: const [
                    Text('রবিবার, ২৬ জুলাই ২০২৬', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                    SizedBox(height: 4),
                    Text('১২ মহররম ১৪৪৮ হিজরী • ১২ শ্রাবণ ১৪৩৩ বঙ্গাব্দ', style: TextStyle(color: Color(0xFFFBBF24), fontSize: 12)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Next Prayer Countdown Card
            Card(
              child: ListTile(
                leading: const Icon(Icons.access_alarm, color: Color(0xFFFBBF24), size: 36),
                title: const Text('পরবর্তী নামাজ: আসর', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                subtitle: const Text('বাকি আছে: ০২ ঘণ্টা ১৫ মিনিট (বিকাল ৪:৩৫ PM)', style: TextStyle(color: Colors.white70)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
