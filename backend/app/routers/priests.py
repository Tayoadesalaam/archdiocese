from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/priests", tags=["priests"])

# Get all priests (users with role PRIEST)
@router.get("/", response_model=List[schemas.UserResponse])
async def get_priests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    parish_id: Optional[int] = None
):
    # Only archbishop or chancellor can view all priests
    if current_user.role.value not in ["ARCHBISHOP", "CHANCELLOR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop or Chancellor can access priest management"
        )
    
    query = db.query(models.User).filter(models.User.role == "PRIEST")
    
    if parish_id:
        query = query.filter(models.User.parish_id == parish_id)
    
    priests = query.offset(skip).limit(limit).all()
    return priests

# Get unassigned priests (no parish)
@router.get("/unassigned", response_model=List[schemas.UserResponse])
async def get_unassigned_priests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role.value not in ["ARCHBISHOP", "CHANCELLOR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop or Chancellor can access this"
        )
    
    priests = db.query(models.User).filter(
        models.User.role == "PRIEST",
        models.User.parish_id == None
    ).all()
    return priests

# Assign priest to parish
@router.post("/assign", response_model=schemas.UserResponse)
async def assign_priest(
    priest_id: int,
    parish_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role.value not in ["ARCHBISHOP", "CHANCELLOR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop or Chancellor can assign priests"
        )
    
    # Check if priest exists
    priest = db.query(models.User).filter(
        models.User.id == priest_id,
        models.User.role == "PRIEST"
    ).first()
    
    if not priest:
        raise HTTPException(status_code=404, detail="Priest not found")
    
    # Check if parish exists
    parish = db.query(models.Parish).filter(models.Parish.id == parish_id).first()
    if not parish:
        raise HTTPException(status_code=404, detail="Parish not found")
    
    # Update priest's parish
    priest.parish_id = parish_id
    db.commit()
    db.refresh(priest)
    
    return priest

# Remove priest from parish (make unassigned)
@router.post("/unassign/{priest_id}", response_model=schemas.UserResponse)
async def unassign_priest(
    priest_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role.value not in ["ARCHBISHOP", "CHANCELLOR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop or Chancellor can unassign priests"
        )
    
    priest = db.query(models.User).filter(
        models.User.id == priest_id,
        models.User.role == "PRIEST"
    ).first()
    
    if not priest:
        raise HTTPException(status_code=404, detail="Priest not found")
    
    priest.parish_id = None
    db.commit()
    db.refresh(priest)
    
    return priest

# Create a new priest user
@router.post("/create", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def create_priest(
    priest: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Only archbishop or chancellor can create priests
    if current_user.role.value not in ["ARCHBISHOP", "CHANCELLOR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop or Chancellor can create priests"
        )
    
    # Check if user already exists
    existing_user = db.query(models.User).filter(
        (models.User.username == priest.username) | (models.User.email == priest.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new priest user (force role to PRIEST)
    hashed_password = auth.get_password_hash(priest.password)
    db_priest = models.User(
        username=priest.username,
        email=priest.email,
        hashed_password=hashed_password,
        first_name=priest.first_name,
        last_name=priest.last_name,
        role="PRIEST",  # Force role to PRIEST
        parish_id=priest.parish_id,  # Can be None or a parish ID
        is_active=True
    )
    
    db.add(db_priest)
    db.commit()
    db.refresh(db_priest)
    
    return db_priest

# Get parishes without a priest (vacant)
@router.get("/vacant-parishes", response_model=List[schemas.ParishResponse])
async def get_vacant_parishes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role.value not in ["ARCHBISHOP", "CHANCELLOR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop or Chancellor can access this"
        )
    
    parishes = db.query(models.Parish).filter(
        models.Parish.priest_id == None
    ).all()
    
    result = []
    for parish in parishes:
        result.append(schemas.ParishResponse(
            id=parish.id,
            name=parish.name,
            location=parish.location,
            priest_id=parish.priest_id,
            priest_name=None,
            deanery=parish.deanery,
            phone=parish.phone,
            email=parish.email,
            member_count=0,
            created_at=parish.created_at
        ))
    
    return result