import 'package:flutter/material.dart';
import 'login_screen.dart';
import '../../../../navigation/bottom_nav_scaffold.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF022C22),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              const Icon(Icons.mosque_rounded, size: 80, color: Color(0xFFFBBF24)),
              const SizedBox(height: 24),
              const Text(
                'বিসমিল্লাহির রহমানির রহীম',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'সঠিক সময়ে নামাজের সময়সূচী, সহীহ আল-কুরআন, হাদিস ভাণ্ডার এবং এআই ইসলামিক অ্যাসিস্ট্যান্ট নিয়ে ২৪ ঘন্টা আপনার সাথেই।',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.white70,
                  height: 1.5,
                ),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const BottomNavScaffold()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFBBF24),
                  foregroundColor: const Color(0xFF022C22),
                  padding: const EdgeInsets.vertical: 16),
                child: const Text('অ্যাপে প্রবেশ করুন', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                  );
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Color(0xFFFBBF24)),
                  padding: const EdgeInsets.vertical: 16,
                ),
                child: const Text('লগইন / রেজিস্টার করুন'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
