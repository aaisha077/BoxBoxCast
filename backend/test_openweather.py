import requests, os

API_KEY = "84e0de03f1eb7924e62460b8372bb26a"
city = "Monaco"
url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

response = requests.get(url)
print("Status Code:", response.status_code)
print("Response:", response.json())
