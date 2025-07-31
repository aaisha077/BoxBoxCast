import os
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("❌ MONGO_URI not found in .env")

client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())

try:
    client.admin.command('ping')
    print("✅ MongoDB connection successful")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

db = client["BoxBoxCast"]   # ✅ correct database name
weather_logs = db["weather_logs"]  # ✅ correct collection
