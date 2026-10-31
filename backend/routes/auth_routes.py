import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from database import get_database
from models import UserRegister, UserLogin, UserResponse, TokenResponse
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def format_user_response(user_doc: dict) -> UserResponse:
    """Helper to convert MongoDB user document to UserResponse model."""
    return UserResponse(
        id=str(user_doc.get("id") or user_doc.get("_id")),
        email=user_doc["email"],
        name=user_doc.get("name", "Quant Trader"),
        handle=user_doc.get("handle", f"@{user_doc['email'].split('@')[0]}"),
        role=user_doc.get("role", "Lead Quant Trader"),
        tier=user_doc.get("tier", "PRO TERMINAL // TIER 3"),
        avatar=user_doc.get("avatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"),
        walletAddress=user_doc.get("walletAddress", "0x71C94829F8a06eDe2E181283626159f81C434b92"),
        riskScore=user_doc.get("riskScore", 84),
        systemStatus=user_doc.get("systemStatus", "OPTIMAL"),
    )

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db=Depends(get_database)):
    """Register a new user in MongoDB."""
    existing_user = await db.users.find_one({"email": user_data.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    hashed_pwd = hash_password(user_data.password)

    new_user_doc = {
        "id": user_id,
        "email": user_data.email.lower(),
        "password_hash": hashed_pwd,
        "name": user_data.name,
        "handle": user_data.handle or f"@{user_data.email.split('@')[0]}",
        "role": user_data.role or "Lead Quant Trader",
        "tier": "PRO TERMINAL // TIER 3",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        "walletAddress": f"0x{uuid.uuid4().hex[:40]}",
        "riskScore": 84,
        "systemStatus": "OPTIMAL",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    await db.users.insert_one(new_user_doc)
    access_token = create_access_token(data={"sub": new_user_doc["email"], "id": user_id})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=format_user_response(new_user_doc)
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db=Depends(get_database)):
    """Authenticate user with email and password, returning JWT token."""
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user["email"], "id": user.get("id")})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=format_user_response(user)
    )

@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get profile of currently authenticated user from MongoDB."""
    return format_user_response(current_user)
