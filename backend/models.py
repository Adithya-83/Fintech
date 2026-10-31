from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# --- Auth Models ---

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password at least 6 characters")
    name: str = Field(..., min_length=2)
    handle: Optional[str] = None
    role: Optional[str] = Field(default="user", description="User role: 'user' or 'admin'")
    title: Optional[str] = Field(default="Lead Quant Trader", description="Trader title/specialization")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    handle: str
    role: str = "user"
    title: Optional[str] = "Lead Quant Trader"
    tier: str
    avatar: str
    walletAddress: str
    riskScore: int
    systemStatus: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Transaction Models ---

class TransactionCreate(BaseModel):
    type: str = Field(..., description="BUY, SELL, STAKING, DEPOSIT, TRANSFER, SWAP")
    asset: str
    symbol: str
    amount: str
    amountUSD: str
    priceAtExecution: Optional[str] = None
    fee: Optional[str] = "$0.00 (Zero-fee Pro)"

class TransactionResponse(BaseModel):
    id: str
    type: str
    asset: str
    symbol: str
    amount: str
    amountUSD: str
    priceAtExecution: str
    date: str
    timeAgo: str
    status: str
    txHash: str
    fullTxHash: str
    fee: str
    iconBg: str

class TransactionListResponse(BaseModel):
    transactions: List[TransactionResponse]
    total: int
    filter: Optional[str] = "ALL"

# --- Dashboard Summary Model ---

class DashboardSummaryResponse(BaseModel):
    totalBalance: float
    currency: str = "USD"
    change24hAmount: float
    change24hPercentage: float
    isPositive24h: bool
    unrealizedProfit: float
    unrealizedProfitPercentage: float
    realizedProfit6M: float
    availableCash: float
    cashApy: float
    sharpeRatio: float
    winRate: str
    maxDrawdown: str

# --- Admin & RBAC Models ---

class RoleUpdateRequest(BaseModel):
    role: str = Field(..., description="Target role: 'user' or 'admin'")

class AdminStatsResponse(BaseModel):
    totalUsers: int
    totalTransactions: int
    totalVolumeUSD: float
    formattedTotalVolume: str
    avgTransactionValue: float
    activeUsers24h: int
    volumeByType: dict
    countByType: dict
    recentUsers: List[dict]
    systemStatus: dict
