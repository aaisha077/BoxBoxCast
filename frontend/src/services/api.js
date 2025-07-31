import axios from "axios";

const API_URL = "http://127.0.0.1:8000/weather";

export const fetchWeather = async (city) => {
  try {
    console.log("🔹 Fetching weather for:", city);
    const res = await axios.get(`${API_URL}?city=${city}`);
    console.log(" API Response:", res.data);
    return res.data;
  } catch (err) {
    console.error(" Error fetching weather:", err);
    return null;
  }
};
