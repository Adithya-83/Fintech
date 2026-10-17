import os
import sys
from pathlib import Path
import pytest
import jwt

# Add backend directory to sys.path so modules import properly
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from auth import hash_password, verify_password, create_access_token
from config import JWT_SECRET, JWT_ALGORITHM
from models import UserRegister, UserLogin, TransactionCreate

def test_password_hashing():
    """Verify that bcrypt hashes and checks passwords correctly."""
    plain = "SuperSecureTraderPwd!2026"
    hashed = hash_password(plain)
    
    assert hashed != plain
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword123", hashed) is False

def test_jwt_generation_and_validation():
    """Verify that pyjwt generates valid signed tokens that decode properly."""
    payload = {"sub": "trader@aether.io", "id": "usr_test123"}
    token = create_access_token(payload)
    
    assert isinstance(token, str)
    decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    assert decoded["sub"] == "trader@aether.io"
    assert decoded["id"] == "usr_test123"
    assert "exp" in decoded

def test_user_models_validation():
    """Verify UserRegister and UserLogin schema validation."""
    user = UserRegister(
        email="quant@aether.io",
        password="password123",
        name="Alex Vance",
        role="Lead Quant Trader"
    )
    assert user.email == "quant@aether.io"
    assert user.role == "Lead Quant Trader"

    login = UserLogin(email="quant@aether.io", password="password123")
    assert login.email == "quant@aether.io"

def test_transaction_create_validation():
    """Verify TransactionCreate model validation."""
    tx = TransactionCreate(
        type="BUY",
        asset="Bitcoin",
        symbol="BTC",
        amount="+0.25 BTC",
        amountUSD="+$24,105.00",
        priceAtExecution="$96,420.00"
    )
    assert tx.type == "BUY"
    assert tx.symbol == "BTC"
