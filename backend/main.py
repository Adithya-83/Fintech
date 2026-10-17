import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from config import BACKEND_PORT, MONGODB_URL, DATABASE_NAME
from database import connect_to_mongo, close_mongo_connection, db_instance
from routes import auth_routes, transaction_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("fintech-backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB via Motor
    logger.info("Starting up Aether FinTech Backend...")
    await connect_to_mongo()
    yield
    # Shutdown: Close MongoDB connection
    logger.info("Shutting down Aether FinTech Backend...")
    await close_mongo_connection()

app = FastAPI(
    title="AETHER // Next-Gen FinTech Terminal API",
    description="High-frequency Quant Investment API backed by MongoDB and FastAPI",
    version="2.4.0",
    lifespan=lifespan
)

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers with /api prefix as well as root level for flexibility
app.include_router(auth_routes.router, prefix="/api")
app.include_router(auth_routes.router)  # exposes /signup, /login directly
app.include_router(transaction_routes.router, prefix="/api")
app.include_router(transaction_routes.router)  # exposes /transactions directly

@app.get("/", tags=["Health"])
@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint confirming MongoDB connectivity and server status."""
    is_connected = False
    mongo_version = "Unknown"
    try:
        if db_instance.client:
            server_info = await db_instance.client.server_info()
            mongo_version = server_info.get("version", "Connected")
            is_connected = True
    except Exception as e:
        logger.error(f"MongoDB health check failed: {e}")

    return {
        "status": "ONLINE",
        "service": "AETHER FinTech Quant Backend",
        "database": {
            "driver": "motor (asyncio)",
            "status": "CONNECTED" if is_connected else "DISCONNECTED",
            "mongodb_url": MONGODB_URL,
            "database_name": DATABASE_NAME,
            "mongo_version": mongo_version,
            "compass_connection_string": "mongodb://localhost:27017"
        },
        "endpoints": {
            "auth_signup": "POST /signup or POST /api/signup",
            "auth_login": "POST /login or POST /api/login",
            "auth_me": "GET /api/me (Protected: Bearer Token)",
            "get_transactions": "GET /transactions or GET /api/transactions (Protected: Bearer Token)",
            "create_transaction": "POST /transactions or POST /api/transactions (Protected: Bearer Token)",
            "dashboard_summary": "GET /api/transactions/summary (Protected: Bearer Token)"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=BACKEND_PORT, reload=True)
