"""
Minimal WSGI application for testing
"""

def application(environ, start_response):
    """Minimal WSGI app"""
    try:
        status = '200 OK'
        headers = [('Content-type', 'application/json')]
        start_response(status, headers)

        response_data = {
            'message': 'Minimal WSGI app working',
            'path': environ.get('PATH_INFO', ''),
            'method': environ.get('REQUEST_METHOD', ''),
            'host': environ.get('HTTP_HOST', ''),
            'server_name': environ.get('SERVER_NAME', ''),
            'server_port': environ.get('SERVER_PORT', ''),
        }

        import json
        return [json.dumps(response_data).encode('utf-8')]
    except Exception as e:
        # If anything fails, return error info
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        return [f'WSGI Error: {str(e)}'.encode('utf-8')]

# For testing - this should be accessible
if __name__ == '__main__':
    print("Test WSGI module loaded successfully")