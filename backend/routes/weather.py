from fastapi import APIRouter, HTTPException
from weather_service import get_weather
from f1_logic import calculate_performance

router = APIRouter()

@router.get("/weather/{city}")
async def weather(city: str):
    weather_data = get_weather(city)
    if not weather_data:
        raise HTTPException(status_code=404, detail="Weather data not found")

    performance = calculate_performance(
        weather_data["temp"],
        weather_data["rain"],
        weather_data["wind"],
        weather_data["humidity"]
    )
    return {"weather": weather_data, "performance": performance}
