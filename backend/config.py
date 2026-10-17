import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the current directory or backend directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# Read the MongoDB connection string using MONGODB_URL from the .env file (with MONGODB_URI fallback)
MONGODB_URL = os.getenv("MONGODB_URL") or os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_URI = MONGODB_URL  # backward compatibility alias

DATABASE_NAME = os.getenv("DATABASE_NAME", "fintech_db")
JWT_SECRET = os.getenv("JWT_SECRET", "cyber_fintech_quant_secret_key_2026_super_secure_node")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
