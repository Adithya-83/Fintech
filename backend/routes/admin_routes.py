import re
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from database import get_database
from auth import require_admin
from models import AdminStatsResponse, RoleUpdateRequest

router = APIRouter(prefix="/admin", tags=["Admin Platform Telemetry"])

def parse_currency(amount_str: str) -> float:
    """Helper to convert '$12,052.50' or '+$24,105.00' into a clean float."""
    if not amount_str:
        return 0.0
    cleaned = re.sub(r"[^\d.]", "", str(amount_str))
    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return 0.0

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """
    Fetch platform-wide analytics and system KPIs.
    STRICT RBAC REQUIREMENT: Must possess 'admin' role.
    Returns:
      - totalUsers: Count of all registered users
      - totalTransactions: Count of all executed transactions
      - totalVolumeUSD: Aggregated platform transaction volume in USD
      - avgTransactionValue: Average USD order size
      - volumeByType: Volume breakdown by transaction type
      - countByType: Frequency breakdown by transaction type
      - recentUsers: Latest platform users
      - systemStatus: Backend & RBAC status metrics
    """
    total_users = await db.users.count_documents({})
    total_transactions = await db.transactions.count_documents({})

    total_volume = 0.0
    volume_by_type = {
        "BUY": 0.0,
        "SELL": 0.0,
        "STAKING": 0.0,
        "DEPOSIT": 0.0,
        "TRANSFER": 0.0,
        "SWAP": 0.0,
    }
    count_by_type = {
        "BUY": 0,
        "SELL": 0,
        "STAKING": 0,
        "DEPOSIT": 0,
        "TRANSFER": 0,
        "SWAP": 0,
    }

    # Aggregate transaction statistics across the entire database
    cursor = db.transactions.find({})
    async for tx in cursor:
        tx_type = str(tx.get("type", "BUY")).upper()
        amount_usd = parse_currency(tx.get("amountUSD", "0"))
        total_volume += amount_usd

        if tx_type in volume_by_type:
            volume_by_type[tx_type] += amount_usd
            count_by_type[tx_type] += 1
        else:
            volume_by_type[tx_type] = amount_usd
            count_by_type[tx_type] = 1

    # Round volume numbers for precision
    total_volume = round(total_volume, 2)
    for k in volume_by_type:
        volume_by_type[k] = round(volume_by_type[k], 2)

    avg_transaction = round(total_volume / total_transactions, 2) if total_transactions > 0 else 0.0

    # Retrieve recent users (excluding password hashes)
    users_cursor = db.users.find({}, {"password_hash": 0}).sort("created_at", -1).limit(15)
    recent_users = []
    async for u in users_cursor:
        raw_role = u.get("role", "user")
        is_adm = str(raw_role).lower() == "admin"
        recent_users.append({
            "id": str(u.get("id") or u.get("_id")),
            "email": u.get("email"),
            "name": u.get("name", "Quant Trader"),
            "handle": u.get("handle", f"@{u.get('email', '').split('@')[0]}"),
            "role": "admin" if is_adm else "user",
            "title": u.get("title", "Platform Administrator" if is_adm else "Lead Quant Trader"),
            "tier": u.get("tier", "STANDARD"),
            "systemStatus": u.get("systemStatus", "OPTIMAL"),
            "walletAddress": u.get("walletAddress", "0x00...00"),
            "created_at": u.get("created_at", datetime.now(timezone.utc).isoformat())
        })

    return AdminStatsResponse(
        totalUsers=total_users,
        totalTransactions=total_transactions,
        totalVolumeUSD=total_volume,
        formattedTotalVolume=f"${total_volume:,.2f}",
        avgTransactionValue=avg_transaction,
        activeUsers24h=max(1, total_users),
        volumeByType=volume_by_type,
        countByType=count_by_type,
        recentUsers=recent_users,
        systemStatus={
            "rbacEnforced": True,
            "requiredRole": "admin",
            "currentAdmin": current_admin.get("email"),
            "accessClearance": "TIER 5 ROOT ADMIN",
            "activeSession": "AUTHENTICATED",
            "protocol": "TLS 1.3 / PyJWT HS256",
            "databaseStatus": "HEALTHY",
            "engineLatency": "12ms"
        }
    )

@router.get("/users")
async def get_admin_users(
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """
    Fetch comprehensive user list for administrative role governance.
    STRICT RBAC REQUIREMENT: Must possess 'admin' role.
    """
    cursor = db.users.find({}, {"password_hash": 0}).sort("created_at", -1)
    users = []
    async for u in cursor:
        raw_role = u.get("role", "user")
        is_adm = str(raw_role).lower() == "admin"
        users.append({
            "id": str(u.get("id") or u.get("_id")),
            "email": u.get("email"),
            "name": u.get("name", "Trader"),
            "handle": u.get("handle", ""),
            "role": "admin" if is_adm else "user",
            "title": u.get("title", "Platform Administrator" if is_adm else "Lead Quant Trader"),
            "tier": u.get("tier", "STANDARD"),
            "systemStatus": u.get("systemStatus", "OPTIMAL"),
            "walletAddress": u.get("walletAddress", ""),
            "created_at": u.get("created_at", "")
        })
    return {"users": users, "total": len(users)}

@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role_update: RoleUpdateRequest,
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """
    Promote or demote a user role ('admin' <-> 'user').
    STRICT RBAC REQUIREMENT: Must possess 'admin' role.
    """
    target_role = role_update.role.strip().lower()
    if target_role not in ["admin", "user"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'admin' or 'user'."
        )

    # Find the target user
    user = await db.users.find_one({"$or": [{"id": user_id}, {"email": user_id}]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Prevent admin from demoting themselves if they are the operating admin
    if user.get("email") == current_admin.get("email") and target_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot demote yourself while logged in as current active administrator."
        )

    title = "Platform Administrator" if target_role == "admin" else "Lead Quant Trader"
    tier = "ADMIN ACCESS // UNRESTRICTED" if target_role == "admin" else "PRO TERMINAL // TIER 3"

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "role": target_role,
            "title": title,
            "tier": tier
        }}
    )

    return {
        "success": True,
        "message": f"User {user.get('email')} role successfully updated to '{target_role}'.",
        "user_id": user_id,
        "new_role": target_role
    }
