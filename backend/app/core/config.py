import os


# ✅ Secret Key (Local + Render compatible)
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "dev_secret_key_change_me_please_update_in_production"
)

# ✅ Algorithm
ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)

# ✅ Token expiry
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        30
    )
)
