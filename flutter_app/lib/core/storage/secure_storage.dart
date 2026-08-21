import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  final _storage = const FlutterSecureStorage();

  static const _keyToken = 'access_token';
  static const _keyUser = 'user_profile';

  Future<void> saveAccessToken(String token) async {
    await _storage.write(key: _keyToken, value: token);
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: _keyToken);
  }

  Future<void> clearAuth() async {
    await _storage.delete(key: _keyToken);
    await _storage.delete(key: _keyUser);
  }
}
