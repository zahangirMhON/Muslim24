import 'package:shared_preferences/shared_preferences.dart';

class OfflineCache {
  static const String _keyPrayerTimes = 'cached_prayer_times';
  static const String _keyLastSync = 'cached_last_sync_timestamp';

  Future<void> cachePrayerData(String jsonData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyPrayerTimes, jsonData);
    await prefs.setString(_keyLastSync, DateTime.now().toIso8601String());
  }

  Future<String?> getCachedPrayerData() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyPrayerTimes);
  }

  Future<String?> getLastSyncTime() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyLastSync);
  }
}
