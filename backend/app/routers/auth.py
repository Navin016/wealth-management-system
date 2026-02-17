from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm
from app.services.risk_service import calculate_risk_score, get_risk_profile

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserCreate, Token, ProfileUpdate, ChangePassword
from app.core.config import SECRET_KEY, ALGORITHM


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(
    schemes=["bcrypt_sha256", "bcrypt"],
    deprecated="auto"
)



def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=get_password_hash(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        data={"sub": str(new_user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login", response_model=Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": str(db_user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", status_code=status.HTTP_200_OK)
def read_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "risk_profile": current_user.risk_profile,
        "kyc_status": current_user.kyc_status,
        "phone": current_user.phone,
        "city": current_user.city,
        "gender": current_user.gender,
        "profession": current_user.profession,
        "age": current_user.age,
        "salary": current_user.salary
        
    }
@router.put("/update-profile")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        # Convert request → dict
        update_data = data.dict(exclude_unset=True)

        # Update only provided fields
        for field, value in update_data.items():
            setattr(current_user, field, value)

        db.commit()
        db.refresh(current_user)

        return {
            "message": "Profile updated successfully"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
# -----------------------------
# CHANGE PASSWORD
# -----------------------------
@router.put("/change-password")
def change_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 1️⃣ Verify old password
    if not verify_password(
        data.old_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    # 2️⃣ Hash new password
    hashed_password = get_password_hash(
        data.new_password
    )

    # 3️⃣ Update DB
    current_user.password = hashed_password

    db.commit()

    return {
        "message": "Password changed successfully"
    }
from app.services.risk_service import calculate_risk_score


@router.get("/risk-profile")
def risk_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    result = calculate_risk_score(
        db,
        current_user.id
    )

    return result

