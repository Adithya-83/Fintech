import os
import sys
from pathlib import Path
try:
    import pytest
except ImportError:
    pytest = None
import jwt

# Add backend directory to sys.path so modules import properly
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from auth import hash_password, verify_password, create_access_token, require_admin
from config import JWT_SECRET, JWT_ALGORITHM
from models import UserRegister, UserLogin, TransactionCreate, RoleUpdateRequest
from fastapi import HTTPException
import asyncio

def test_password_hashing():
    """Verify that bcrypt hashes and checks passwords correctly."""
    plain = "SuperSecureTraderPwd!2026"
    hashed = hash_password(plain)
    
    assert hashed != plain
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword123", hashed) is False

def test_jwt_generation_and_validation():
    """Verify that pyjwt generates valid signed tokens that decode properly and include role."""
    payload = {"sub": "trader@aether.io", "id": "usr_test123"}
    token = create_access_token(payload)
    
    assert isinstance(token, str)
    decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    assert decoded["sub"] == "trader@aether.io"
    assert decoded["id"] == "usr_test123"
    assert decoded["role"] == "user"  # Defaults to user
    assert "exp" in decoded

def test_jwt_generation_with_admin_role():
    """Verify JWT generation explicitly embeds admin role in payload."""
    payload = {"sub": "admin@aether.io", "id": "usr_admin_001", "role": "admin"}
    token = create_access_token(payload)
    decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    assert decoded["sub"] == "admin@aether.io"
    assert decoded["role"] == "admin"

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

def test_user_register_role_default_and_admin():
    """Verify UserRegister defaults role to 'user' and allows 'admin'."""
    # Default to 'user'
    default_user = UserRegister(
        email="trader@aether.io",
        password="password123",
        name="Jane Trader"
    )
    assert default_user.role == "user"

    # Explicit 'admin' role
    admin_user = UserRegister(
        email="boss@aether.io",
        password="password123",
        name="Boss Admin",
        role="admin"
    )
    assert admin_user.role == "admin"

def test_rbac_require_admin():
    """Verify require_admin strictly enforces role == 'admin' and blocks 'user' with 403."""
    admin_context = {"email": "admin@aether.io", "role": "admin"}
    user_context = {"email": "trader@aether.io", "role": "user"}

    # Admin should succeed
    res = asyncio.run(require_admin(current_user=admin_context))
    assert res["role"] == "admin"

    # Regular user should raise 403 Forbidden
    if pytest:
        with pytest.raises(HTTPException) as exc_info:
            asyncio.run(require_admin(current_user=user_context))
        assert exc_info.value.status_code == 403
        assert "Forbidden" in exc_info.value.detail
    else:
        try:
            asyncio.run(require_admin(current_user=user_context))
            assert False, "Expected 403 Forbidden"
        except HTTPException as e:
            assert e.status_code == 403
            assert "Forbidden" in e.detail

def test_role_update_request_validation():
    """Verify RoleUpdateRequest schema validates correctly."""
    req = RoleUpdateRequest(role="admin")
    assert req.role == "admin"

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

if __name__ == "__main__":
    print("Running backend RBAC test suite...")
    test_password_hashing()
    print("✔ test_password_hashing passed")
    test_jwt_generation_and_validation()
    print("✔ test_jwt_generation_and_validation passed")
    test_jwt_generation_with_admin_role()
    print("✔ test_jwt_generation_with_admin_role passed")
    test_user_models_validation()
    print("✔ test_user_models_validation passed")
    test_user_register_role_default_and_admin()
    print("✔ test_user_register_role_default_and_admin passed")
    # RBAC assertion
    admin_ctx = {"email": "admin@aether.io", "role": "admin"}
    res = asyncio.run(require_admin(current_user=admin_ctx))
    assert res["role"] == "admin"
    try:
        asyncio.run(require_admin(current_user={"email": "trader@aether.io", "role": "user"}))
        raise AssertionError("Expected HTTPException 403")
    except HTTPException as e:
        assert e.status_code == 403
    print("✔ test_rbac_require_admin passed")
    test_role_update_request_validation()
    print("✔ test_role_update_request_validation passed")
    test_transaction_create_validation()
    print("✔ test_transaction_create_validation passed")
    print("ALL 8 BACKEND & RBAC TESTS PASSED SUCCESSFULLY!")
