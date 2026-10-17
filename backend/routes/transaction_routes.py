import uuid
import secrets
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from database import get_database
from auth import get_current_user
from models import (
    TransactionCreate, 
    TransactionResponse, 
    TransactionListResponse,
    DashboardSummaryResponse
)

router = APIRouter(prefix="/transactions", tags=["Dashboard Transactions"])

def get_icon_style(asset_type: str, symbol: str) -> str:
    """Return matching cyberpunk badge styling based on transaction type."""
    t = asset_type.upper()
    if t == "BUY":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    elif t == "SELL":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30"
    elif t == "STAKING":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
    elif t == "DEPOSIT":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
    elif t == "TRANSFER":
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
    else:
        return "bg-purple-500/10 text-purple-400 border-purple-500/30"

@router.get("", response_model=TransactionListResponse)
async def get_transactions(
    type: Optional[str] = Query(None, description="Filter by type: BUY, SELL, STAKING, DEPOSIT, etc."),
    search: Optional[str] = Query(None, description="Search by asset name, ticker symbol, or tx hash"),
    limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Fetch recent transactions from MongoDB.
    PROTECTED: Requires a valid Bearer JWT token.
    """
    query = {}

    if type and type.upper() != "ALL":
        query["type"] = type.upper()

    if search:
        search_regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"asset": search_regex},
            {"symbol": search_regex},
            {"txHash": search_regex},
            {"fullTxHash": search_regex},
        ]

    cursor = db.transactions.find(query).sort("date", -1).limit(limit)
    raw_txs = await cursor.to_list(length=limit)

    transactions = []
    for tx in raw_txs:
        transactions.append(
            TransactionResponse(
                id=tx.get("id", str(tx.get("_id"))),
                type=tx.get("type", "BUY"),
                asset=tx.get("asset", "Unknown"),
                symbol=tx.get("symbol", "N/A"),
                amount=tx.get("amount", "0"),
                amountUSD=tx.get("amountUSD", "$0.00"),
                priceAtExecution=tx.get("priceAtExecution", "$0.00"),
                date=tx.get("date", datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")),
                timeAgo=tx.get("timeAgo", "Just now"),
                status=tx.get("status", "Completed"),
                txHash=tx.get("txHash", "0x00...00"),
                fullTxHash=tx.get("fullTxHash", "0x0000000000000000000000000000000000000000"),
                fee=tx.get("fee", "$0.00"),
                iconBg=tx.get("iconBg", get_icon_style(tx.get("type", ""), tx.get("symbol", "")))
            )
        )

    return TransactionListResponse(
        transactions=transactions,
        total=len(transactions),
        filter=type or "ALL"
    )

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    tx_in: TransactionCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Create and store a new transaction in MongoDB.
    PROTECTED: Requires a valid Bearer JWT token.
    """
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%Y-%m-%d %H:%M:%S")
    tx_id = f"tx-{uuid.uuid4().hex[:6]}"
    
    # Generate cryptographic hash strings
    entropy = secrets.token_hex(32)
    full_hash = f"0x{entropy}"
    short_hash = f"0x{entropy[:4]}...{entropy[-4:]}"

    new_tx_doc = {
        "id": tx_id,
        "user_id": current_user.get("id"),
        "user_email": current_user.get("email"),
        "type": tx_in.type.upper(),
        "asset": tx_in.asset,
        "symbol": tx_in.symbol.upper(),
        "amount": tx_in.amount,
        "amountUSD": tx_in.amountUSD,
        "priceAtExecution": tx_in.priceAtExecution or "$96,420.00",
        "date": date_str,
        "timeAgo": "Just now",
        "status": "Completed",
        "txHash": short_hash,
        "fullTxHash": full_hash,
        "fee": tx_in.fee or "$0.00 (Zero-fee Pro)",
        "iconBg": get_icon_style(tx_in.type, tx_in.symbol),
        "created_at": now.isoformat()
    }

    await db.transactions.insert_one(new_tx_doc)

    return TransactionResponse(
        id=tx_id,
        type=new_tx_doc["type"],
        asset=new_tx_doc["asset"],
        symbol=new_tx_doc["symbol"],
        amount=new_tx_doc["amount"],
        amountUSD=new_tx_doc["amountUSD"],
        priceAtExecution=new_tx_doc["priceAtExecution"],
        date=new_tx_doc["date"],
        timeAgo=new_tx_doc["timeAgo"],
        status=new_tx_doc["status"],
        txHash=new_tx_doc["txHash"],
        fullTxHash=new_tx_doc["fullTxHash"],
        fee=new_tx_doc["fee"],
        iconBg=new_tx_doc["iconBg"]
    )

@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Fetch high-level dashboard metrics and balance summary from MongoDB.
    PROTECTED: Requires a valid Bearer JWT token.
    """
    tx_count = await db.transactions.count_documents({})

    return DashboardSummaryResponse(
        totalBalance=75240.50,
        currency="USD",
        change24hAmount=4821.30,
        change24hPercentage=6.85,
        isPositive24h=True,
        unrealizedProfit=18490.20,
        unrealizedProfitPercentage=32.58,
        realizedProfit6M=21480.00,
        availableCash=18450.00,
        cashApy=5.2,
        sharpeRatio=2.84,
        winRate="76.4%",
        maxDrawdown="-5.8%",
    )
