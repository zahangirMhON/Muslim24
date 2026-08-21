import 'dart:convert';
import 'package:http/http.dart' as http;
import '../storage/secure_storage.dart';

class ApiClient {
  static const String baseUrl = 'http://10.0.2.2:3000/api/v1'; // Local dev host or Cloud Run URL
  final SecureStorage _storage = SecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> get(String endpoint) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(Uri.parse('$baseUrl$endpoint'), headers: headers);
      return _processResponse(response);
    } catch (e) {
      throw ApiException('নেটওয়ার্ক সংযোগে সমস্যা হয়েছে: $e');
    }
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(body),
      );
      return _processResponse(response);
    } catch (e) {
      throw ApiException('নেটওয়ার্ক সংযোগে সমস্যা হয়েছে: $e');
    }
  }

  dynamic _processResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 401) {
      throw ApiException('অনুমোদন নেই। পুনরায় লগইন করুন।');
    } else {
      final body = jsonDecode(response.body);
      throw ApiException(body['error']?['message'] ?? 'সার্ভারে একটি ত্রুটি ঘটেছে।');
    }
  }
}

class ApiException implements Exception {
  final String message;
  ApiException(this.message);

  @override
  String toString() => message;
}
