# BoxBoxCast
BoxBoxCast is a full-stack Formula 1 weather prediction and car performance analysis website. It fetches real-time weather data using the OpenWeather API and predicts car performance metrics such as grip, downforce, engine power, and lap time based on dynamic conditions. The backend, built with FastAPI, exposes RESTful APIs, while the React.js frontend provides an interactive UI. The project integrates weather-based strategies like DRS and tire recommendations for an enhanced Formula 1 experience.

## ✨ Features
- **Live Weather Fetching** using FastAPI backend  
- **Performance Simulation** based on weather factors (grip, downforce, power)  
- **DRS (Drag Reduction System) Integration** with realistic lap time boost  
- **Dynamic Tire Recommendations** (Soft, Medium, Hard, Intermediates, Full Wets)  
- **Pit Stop & Fuel Strategy Suggestions**  
- Modern UI built with **React + TailwindCSS**  
- Fully functional **FastAPI backend** serving data to frontend  

## 🚀 Installation & Usage

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/aaisha077/BoxBoxCast.git
cd BoxBoxCast


cd backend
python3 -m venv venv
source venv/bin/activate   # For Mac/Linux
venv\Scripts\activate      # For Windows
pip install -r requirements.txt
uvicorn main:app --reload


cd frontend
npm install
npm start



