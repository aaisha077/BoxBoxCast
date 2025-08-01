from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests, os
from dotenv import load_dotenv
from f1_logic import calculate_performance

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

#  Get weather by coordinates
@app.get("/weather/coords")
def get_weather_by_coords(lat: float, lon: float):
    if not OPENWEATHER_API_KEY:
        return {"error": "Missing API key"}

    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    r = requests.get(url).json()

    wind = r.get("wind", {})
    main = r.get("main", {})
    rain = r.get("rain", {})

    return {
        "temp": main.get("temp", 0),
        "humidity": main.get("humidity", 0),
        "rain": rain.get("1h", 0),
        "wind": wind.get("speed", 0),
        "wind_deg": wind.get("deg", 0),
        "wind_gust": wind.get("gust", 0)
    }

#  Weather by city (query parameter)
@app.get("/weather")
def get_weather_query(city: str = "Monaco"):
    return fetch_weather(city)

#  Weather by city (path parameter)
@app.get("/weather/{city}")
def get_weather_path(city: str):
    return fetch_weather(city)

#  Shared logic
def fetch_weather(city: str):
    if not OPENWEATHER_API_KEY:
        return {"error": "Missing API key"}

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    r = requests.get(url).json()

    try:
        cod = int(r.get("cod", 0))
    except:
        cod = 0

    if cod != 200:
        return {"error": r.get("message", "Failed to fetch weather")}

    temp = r["main"]["temp"]
    humidity = r["main"]["humidity"]
    wind = r["wind"]["speed"]
    rain = r.get("rain", {}).get("1h", 0)

    performance = calculate_performance(temp, rain, wind, humidity)

    weather_data = {
        "city": r.get("name", "Unknown Location"),
        "description": r["weather"][0]["description"],
        "temp": temp,
        "humidity": humidity,
        "wind": wind,
        "rain": rain,
        "performance": performance
    }

    
    return weather_data
