import requests

SUPPORTED_HTTP_METHODS = set([
    "GET", "OPTIONS", "HEAD", "POST", "PUT", "PATCH", "DELETE"
])

def invoke_http(url, method='GET', json=None, cookies=None, **kwargs):
    """A simple wrapper for requests methods.
       url: the URL of the HTTP service;
       method: the HTTP method;
       json: the JSON input when needed by the HTTP method;
       return: the JSON reply content from the HTTP service if the call succeeds;
            otherwise, return a JSON object with a "code" name-value pair.
    """
    try:
        if method.upper() not in SUPPORTED_HTTP_METHODS:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        r = requests.request(method, url, json=json, cookies=cookies, **kwargs)
        r.raise_for_status()  # Raise exception for bad status codes
        return r.json() if r.content else None
    except requests.RequestException as e:
        return {"code": 500, "message": f"HTTP request failed: {str(e)}"}
    except ValueError as e:
        return {"code": 400, "message": str(e)}
