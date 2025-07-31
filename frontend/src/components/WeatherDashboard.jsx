import React, { useState, useEffect } from "react";
import { fetchWeather } from "../services/api";

export default function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Monaco");

  useEffect(() => {
    loadWeather("Monaco"); // ✅ fetch weather for default city
  }, []);

  const loadWeather = async (cityName) => {
    const data = await fetchWeather(cityName);
    console.log("🌤️ Received data:", data);
    if (data) setWeather(data);
  };

  return (
    <div className="p-6 text-center bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">🏎️ BoxBoxCast - Race Weather Dashboard</h1>

      {/* ✅ User types ANY city or F1 circuit */}
      <input
        type="text"
        placeholder="Type F1 circuit or city..."
        className="p-2 text-black rounded w-64"
        onKeyDown={(e) => e.key === "Enter" && loadWeather(e.target.value)}
      />

      {weather ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{weather.city}</h2>
          <p>🌡️ Temp: {weather.temp}°C</p>
          <p>🌥️ Condition: {weather.description}</p>
          <p>🌧️ Rain: {weather.rain} mm (last hour)</p>
          <p>💨 Wind: {weather.wind} m/s</p>
          <p>💧 Humidity: {weather.humidity}%</p>

          {/* ✅ F1 Performance */}
          <div className="mt-4 p-3 bg-gray-800 rounded">
            <h3 className="text-lg font-bold">🏁 F1 Performance Metrics</h3>
            <p>🛞 Grip: {weather.performance.grip}%</p>
            <p>🪶 Downforce: {weather.performance.downforce}%</p>
            <p>⚡ Engine Power: {weather.performance.engine_power}%</p>
            <p>⏱️ Estimated Lap Time: {weather.performance.lap_time}s</p>
          </div>
        </div>
      ) : (
        <p>Loading weather…</p>
      )}
    </div>
  );
}

