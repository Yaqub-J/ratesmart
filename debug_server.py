#!/usr/bin/env python3
"""
Debug server that logs everything
"""

import os
import sys
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

class DebugHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.log_request_details("GET")
        self.send_success_response("GET request processed")

    def do_POST(self):
        self.log_request_details("POST")
        self.send_success_response("POST request processed")

    def do_OPTIONS(self):
        self.log_request_details("OPTIONS")
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_HEAD(self):
        self.log_request_details("HEAD")
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def log_request_details(self, method):
        print(f"\n=== {method} REQUEST DEBUG ===")
        print(f"Path: {self.path}")
        print(f"Client: {self.client_address}")
        print(f"Command: {self.command}")
        print(f"Request version: {self.request_version}")
        print(f"Headers:")
        for header, value in self.headers.items():
            print(f"  {header}: {value}")

        # Log raw request line
        print(f"Raw request line: {self.requestline}")

        # For POST, log body
        if method == "POST":
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                body = self.rfile.read(content_length)
                print(f"Body: {body}")

    def send_success_response(self, message):
        try:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', '*')
            self.end_headers()

            response = {
                'status': 'success',
                'message': message,
                'path': self.path,
                'method': self.command,
                'server': 'Debug Server',
                'port': os.environ.get('PORT', 'unknown')
            }

            self.wfile.write(json.dumps(response).encode())
            print(f"✓ Sent successful response for {self.command} {self.path}")
        except Exception as e:
            print(f"✗ Error sending response: {e}")

    def log_message(self, format, *args):
        print(f"[HTTP-LOG] {format % args}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))

    print("=== DEBUG SERVER STARTUP ===")
    print(f"Python: {sys.version}")
    print(f"Working dir: {os.getcwd()}")
    print(f"Port: {port}")
    print(f"Bind address: 0.0.0.0:{port}")

    try:
        server = HTTPServer(('0.0.0.0', port), DebugHandler)
        print(f"✓ Server created at {server.server_address}")
        print("✓ Starting server...")
        print("=== SERVER READY - WAITING FOR REQUESTS ===")

        server.serve_forever()

    except Exception as e:
        print(f"✗ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()