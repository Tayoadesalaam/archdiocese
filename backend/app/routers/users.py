from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[schemas.UserResponse])
async def get_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
    role: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1)
):
    """Get users with optional role filter"""
    query = db.query(models.User)
    
    if role:
        query = query.filter(models.User.role == role)
    
    users = query.offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user