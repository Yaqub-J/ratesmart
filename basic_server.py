#!/usr/bin/env python3
"""
Ultra basic server for Render debugging
"""

import os
import sys
import socket

def test_port_binding():
    """Test if we can bind to the port"""
    port = int(os.environ.get('PORT', 8000))
    print(f"Testing port binding on port {port}")

    try:
        # Test socket binding
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('0.0.0.0', port))
        sock.listen(1)
        print(f"✓ Successfully bound to port {port}")
        sock.close()
        return True
    except Exception as e:
        print(f"✗ Failed to bind to port {port}: {e}")
        return False

def minimal_server():
    """Most basic HTTP server possible"""
    port = int(os.environ.get('PORT', 8000))

    print(f"=== BASIC SERVER STARTUP ===")
    print(f"Python version: {sys.version}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Environment PORT: {os.environ.get('PORT', 'Not set')}")
    print(f"Target port: {port}")
    print(f"All environment vars: {dict(os.environ)}")

    # Test port binding first
    if not test_port_binding():
        print("FATAL: Cannot bind to port - exiting")
        sys.exit(1)

    # Import HTTP server components
    try:
        from http.server import HTTPServer, BaseHTTPRequestHandler
        print("✓ HTTP server modules imported successfully")
    except Exception as e:
        print(f"✗ Failed to import HTTP server: {e}")
        sys.exit(1)

    class MinimalHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            print(f"Processing GET {self.path}")
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'BASIC SERVER WORKING')

        def do_OPTIONS(self):
            print(f"Processing OPTIONS {self.path}")
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.end_headers()

        def log_message(self, format, *args):
            print(f"[HTTP] {format % args}")

    try:
        print(f"Creating HTTPServer on 0.0.0.0:{port}")
        server = HTTPServer(('0.0.0.0', port), MinimalHandler)
        print(f"✓ HTTPServer created successfully")
        print(f"Server address: {server.server_address}")
        print(f"Starting server...")

        server.serve_forever()

    except Exception as e:
        print(f"✗ Server startup failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    minimal_server()