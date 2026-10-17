import logging
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGODB_URL, DATABASE_NAME

logger = logging.getLogger("fintech-backend")

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_instance = MongoDB()

async def connect_to_mongo():
    """Connect to MongoDB using Motor async driver."""
    try:
        logger.info(f"Connecting to MongoDB at {MONGODB_URL} (Database: {DATABASE_NAME})...")
        db_instance.client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Ping the server to ensure connection is live
        await db_instance.client.admin.command('ping')
        db_instance.db = db_instance.client[DATABASE_NAME]
        logger.info("Successfully connected to MongoDB!")

        # Initialize collections and indexes
        await init_collections()
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close MongoDB connection on app shutdown."""
    if db_instance.client:
        logger.info("Closing MongoDB connection...")
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    """Dependency helper to get active database."""
    return db_instance.db

async def init_collections():
    """Ensure indexes and seed initial dummy transactions if empty."""
    db = db_instance.db
    if db is None:
        return

    # Index on users.email
    await db.users.create_index("email", unique=True)
    await db.users.create_index("handle", unique=False)

    # Index on transactions.id and transactions.date
    await db.transactions.create_index("id", unique=True)
    await db.transactions.create_index("date")

    # Check if transactions collection is empty, and seed with initial fintech data
    count = await db.transactions.count_documents({})
    if count == 0:
        logger.info("Seeding initial transactions into MongoDB...")
        seed_transactions = [
            {
                "id": "tx-001",
                "type": "BUY",
                "asset": "Bitcoin",
                "symbol": "BTC",
                "amount": "+0.125 BTC",
                "amountUSD": "$12,052.50",
                "priceAtExecution": "$96,420.00",
                "date": "2026-10-16 14:32:08",
                "timeAgo": "2 hours ago",
                "status": "Completed",
                "txHash": "0x8f2a...c4b1",
                "fullTxHash": "0x8f2a9d8e7c1b5a3f2d4e6a8b0c2e4f6a8b0c2e4f6a8b0c2e4f6a8b0c2e4fc4b1",
                "fee": "$2.40 (0.000025 BTC)",
                "iconBg": "bg-amber-500/10 text-amber-400 border-amber-500/30",
            },
            {
                "id": "tx-002",
                "type": "STAKING",
                "asset": "Ethereum",
                "symbol": "ETH",
                "amount": "+0.048 ETH",
                "amountUSD": "$167.30",
                "priceAtExecution": "$3,485.60",
                "date": "2026-10-16 08:15:22",
                "timeAgo": "8 hours ago",
                "status": "Completed",
                "txHash": "0x3e17...82f0",
                "fullTxHash": "0x3e179c2a8f6d4b0e1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b82f0",
                "fee": "$0.00 (Validator Yield)",
                "iconBg": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
            },
            {
                "id": "tx-003",
                "type": "SELL",
                "asset": "Solana",
                "symbol": "SOL",
                "amount": "-15.0 SOL",
                "amountUSD": "$3,214.50",
                "priceAtExecution": "$214.30",
                "date": "2026-10-15 19:40:11",
                "timeAgo": "1 day ago",
                "status": "Completed",
                "txHash": "0x7b44...a90e",
                "fullTxHash": "0x7b4412df598bc321a0d876fe4521bcde3908f421acbe87612d34e908f421a90e",
                "fee": "$0.08 (0.0004 SOL)",
                "iconBg": "bg-rose-500/10 text-rose-400 border-rose-500/30",
            },
            {
                "id": "tx-004",
                "type": "BUY",
                "asset": "NVIDIA Corp",
                "symbol": "NVDA",
                "amount": "+25 Shares",
                "amountUSD": "$3,570.00",
                "priceAtExecution": "$142.80",
                "date": "2026-10-14 15:05:44",
                "timeAgo": "2 days ago",
                "status": "Completed",
                "txHash": "0x1d99...53cb",
                "fullTxHash": "0x1d99432e1a78bf90dc543210abedcf90874521360987412356980124567853cb",
                "fee": "$0.00 (Zero-fee Pro)",
                "iconBg": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
            },
            {
                "id": "tx-005",
                "type": "DEPOSIT",
                "asset": "USD Coin",
                "symbol": "USDC",
                "amount": "+5,000 USDC",
                "amountUSD": "$5,000.00",
                "priceAtExecution": "$1.00",
                "date": "2026-10-13 11:22:30",
                "timeAgo": "3 days ago",
                "status": "Completed",
                "txHash": "0x6f02...11ac",
                "fullTxHash": "0x6f028912ef54ac397890124578901245678901234567890123456789012311ac",
                "fee": "$1.20 (Network)",
                "iconBg": "bg-blue-500/10 text-blue-400 border-blue-500/30",
            },
            {
                "id": "tx-006",
                "type": "SWAP",
                "asset": "Apple Inc.",
                "symbol": "AAPL",
                "amount": "+10 Shares",
                "amountUSD": "$2,321.00",
                "priceAtExecution": "$232.10",
                "date": "2026-10-12 16:45:00",
                "timeAgo": "4 days ago",
                "status": "Completed",
                "txHash": "0x4a88...2e77",
                "fullTxHash": "0x4a887b6543210feadcba9876543210fedcba9876543210fedcba987654322e77",
                "fee": "$0.00",
                "iconBg": "bg-purple-500/10 text-purple-400 border-purple-500/30",
            },
            {
                "id": "tx-007",
                "type": "BUY",
                "asset": "Ethereum",
                "symbol": "ETH",
                "amount": "+2.50 ETH",
                "amountUSD": "$8,575.00",
                "priceAtExecution": "$3,430.00",
                "date": "2026-10-10 09:12:45",
                "timeAgo": "6 days ago",
                "status": "Completed",
                "txHash": "0x9c31...44ff",
                "fullTxHash": "0x9c312789456123abcdebfa0987654321bcdef0987654321bcdef0987654344ff",
                "fee": "$3.50",
                "iconBg": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
            },
            {
                "id": "tx-008",
                "type": "TRANSFER",
                "asset": "USD Coin",
                "symbol": "USDC",
                "amount": "-1,200 USDC",
                "amountUSD": "$1,200.00",
                "priceAtExecution": "$1.00",
                "date": "2026-10-08 18:03:19",
                "timeAgo": "1 week ago",
                "status": "Completed",
                "txHash": "0x2e50...99bb",
                "fullTxHash": "0x2e508761234509871234567890123456789012345678901234567890123499bb",
                "fee": "$0.75",
                "iconBg": "bg-slate-500/10 text-slate-400 border-slate-500/30",
            },
        ]
        await db.transactions.insert_many(seed_transactions)
        logger.info("Successfully seeded 8 transactions into MongoDB fintech_db!")
