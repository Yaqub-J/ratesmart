#!/usr/bin/env python3
"""
Most basic HTTP server for testing Render deployment
"""

import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        response = {
            'message': 'Simple HTTP server working!',
            'path': self.path,
            'method': 'GET',
            'server': 'Python HTTP Server',
            'port': os.environ.get('PORT', 'unknown'),
            'working': True
        }

        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        response = {
            'message': 'POST request received!',
            'path': self.path,
            'method': 'POST',
            'server': 'Python HTTP Server',
            'working': True
        }

        self.wfile.write(json.dumps(response).encode())

    def log_message(self, format, *args):
        print(f"[REQUEST] {format % args}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting simple HTTP server on port {port}")

    server = HTTPServer(('0.0.0.0', port), SimpleHandler)
    print(f"Server started at http://0.0.0.0:{port}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Server stopped")
        server.server_close()