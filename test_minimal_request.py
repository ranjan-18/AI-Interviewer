
import requests

url = "http://127.0.0.1:8001/upload"
files = {'file': ('resume.pdf', b'%PDF-1.4 dummy', 'application/pdf')}

try:
    print(f"Sending POST request to {url}...")
    r = requests.post(url, files=files)
    print(f"Status Code: {r.status_code}")
    print(f"Response: {r.text}")
except Exception as e:
    print(f"Request failed: {e}")
