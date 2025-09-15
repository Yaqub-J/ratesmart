"""
Minimal WSGI application for testing
"""

def application(environ, start_response):
    """Minimal WSGI app"""
    status = '200 OK'
    headers = [('Content-type', 'application/json')]
    start_response(status, headers)

    response_data = {
        'message': 'Minimal WSGI app working',
        'path': environ.get('PATH_INFO', ''),
        'method': environ.get('REQUEST_METHOD', ''),
        'host': environ.get('HTTP_HOST', ''),
    }

    import json
    return [json.dumps(response_data).encode('utf-8')]