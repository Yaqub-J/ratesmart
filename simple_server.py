#!/usr/bin/env python3
"""
Most basic HTTP server for testing Render deployment
"""

import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            print(f"[GET] {self.path} from {self.client_address}")
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()

            response = {
                'message': 'Simple HTTP server working!',
                'path': self.path,
                'method': 'GET',
                'server': 'Python HTTP Server',
                'port': os.environ.get('PORT', 'unknown'),
                'working': True,
                'timestamp': str(__import__('datetime').datetime.now())
            }

            self.wfile.write(json.dumps(response).encode())
            print(f"[GET] Successfully responded to {self.path}")
        except Exception as e:
            print(f"[GET ERROR] {e}")
            self.send_error(500, f"Server error: {e}")

    def do_POST(self):
        try:
            print(f"[POST] {self.path} from {self.client_address}")
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()

            response = {
                'message': 'POST request received!',
                'path': self.path,
                'method': 'POST',
                'server': 'Python HTTP Server',
                'working': True,
                'timestamp': str(__import__('datetime').datetime.now())
            }

            self.wfile.write(json.dumps(response).encode())
            print(f"[POST] Successfully responded to {self.path}")
        except Exception as e:
            print(f"[POST ERROR] {e}")
            self.send_error(500, f"Server error: {e}")

    def do_OPTIONS(self):
        try:
            print(f"[OPTIONS] {self.path} from {self.client_address}")
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.send_header('Content-Length', '0')
            self.end_headers()
            print(f"[OPTIONS] Successfully responded to {self.path}")
        except Exception as e:
            print(f"[OPTIONS ERROR] {e}")
            self.send_error(500, f"Server error: {e}")

    def log_message(self, format, *args):
        print(f"[REQUEST] {format % args}")

    def do_HEAD(self):
        try:
            print(f"[HEAD] {self.path} from {self.client_address}")
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
        except Exception as e:
            print(f"[HEAD ERROR] {e}")

    def version_string(self):
        return f"SimpleHTTPServer/1.0"

if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', 8000))
        print(f"Environment PORT: {os.environ.get('PORT', 'Not set')}")
        print(f"Starting simple HTTP server on port {port}")

        server = HTTPServer(('0.0.0.0', port), SimpleHandler)
        print(f"Server started at http://0.0.0.0:{port}")
        print("Server is ready to accept connections")

        server.serve_forever()
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()
    except KeyboardInterrupt:
        print("Server stopped")
        server.server_close()