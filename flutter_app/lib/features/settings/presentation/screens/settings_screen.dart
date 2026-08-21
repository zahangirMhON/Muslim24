import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _dataSaver = false;
  String _selectedDistrict = 'ঢাকা';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('অ্যাপ সেটিংস')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              title: const Text('জেলা নির্বাচন', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              subtitle: Text(_selectedDistrict, style: const TextStyle(color: Color(0xFFFBBF24))),
              trailing: const Icon(Icons.arrow_drop_down, color: Colors.white),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: SwitchListTile(
              title: const Text('ডেটা সেভার মোড (কম ডেটা ব্যবহার)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              value: _dataSaver,
              activeColor: const Color(0xFFFBBF24),
              onChanged: (val) => setState(() => _dataSaver = val),
            ),
          ),
        ],
      ),
    );
  }
}
