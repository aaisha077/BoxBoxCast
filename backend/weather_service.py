import requests, os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_weather(city):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    r = requests.get(url)
    data = r.json()
    
    #  Debug log (temporarily)
    print("DEBUG WEATHER DATA:", data)

    #  Check if API returned error
    if r.status_code != 200 or "main" not in data:
        return None
    
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    wind = data["wind"]["speed"]
    rain = data.get("rain", {}).get("1h", 0)

    return {
        "city": data.get("name", city),
        "temp": temp,
        "humidity": humidity,
        "wind": wind,
        "rain": rain
    }
