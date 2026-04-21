from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/parishes", tags=["parishes"])

# Get all parishes
@router.get("/", response_model=List[schemas.ParishResponse])
async def get_parishes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1)
):
    """Get all parishes (archbishop only)"""
    if current_user.role.value != "ARCHBISHOP":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop can view all parishes"
        )
    
    parishes = db.query(models.Parish).offset(skip).limit(limit).all()
    
    # Add priest names and member counts
    result = []
    for parish in parishes:
        # Get priest name if assigned
        priest_name = None
        if parish.priest_id:
            priest = db.query(models.User).filter(models.User.id == parish.priest_id).first()
            if priest:
                priest_name = f"Fr. {priest.first_name} {priest.last_name}"
        
        # Get member count
        member_count = db.query(models.User).filter(models.User.parish_id == parish.id).count()
        
        result.append(schemas.ParishResponse(
            id=parish.id,
            name=parish.name,
            location=parish.location,
            priest_id=parish.priest_id,
            priest_name=priest_name,
            deanery=parish.deanery,
            phone=parish.phone,
            email=parish.email,
            member_count=member_count,
            created_at=parish.created_at
        ))
    
    return result

# Get single parish
@router.get("/{parish_id}", response_model=schemas.ParishResponse)
async def get_parish(
    parish_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Get a specific parish"""
    parish = db.query(models.Parish).filter(models.Parish.id == parish_id).first()
    if not parish:
        raise HTTPException(status_code=404, detail="Parish not found")
    
    # Check permission (archbishop or priest of that parish)
    if current_user.role.value != "ARCHBISHOP" and current_user.parish_id != parish_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this parish"
        )
    
    # Get priest name
    priest_name = None
    if parish.priest_id:
        priest = db.query(models.User).filter(models.User.id == parish.priest_id).first()
        if priest:
            priest_name = f"Fr. {priest.first_name} {priest.last_name}"
    
    # Get member count
    member_count = db.query(models.User).filter(models.User.parish_id == parish.id).count()
    
    return schemas.ParishResponse(
        id=parish.id,
        name=parish.name,
        location=parish.location,
        priest_id=parish.priest_id,
        priest_name=priest_name,
        deanery=parish.deanery,
        phone=parish.phone,
        email=parish.email,
        member_count=member_count,
        created_at=parish.created_at
    )

# Create new parish
@router.post("/", response_model=schemas.ParishResponse, status_code=status.HTTP_201_CREATED)
async def create_parish(
    parish: schemas.ParishCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Create a new parish (archbishop only)"""
    if current_user.role.value != "ARCHBISHOP":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop can create parishes"
        )
    
    # Check if parish with same name exists
    existing = db.query(models.Parish).filter(models.Parish.name == parish.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A parish with this name already exists"
        )
    
    db_parish = models.Parish(
        name=parish.name,
        location=parish.location,
        priest_id=parish.priest_id,
        deanery=parish.deanery,
        phone=parish.phone,
        email=parish.email
    )
    
    db.add(db_parish)
    db.commit()
    db.refresh(db_parish)
    
    return db_parish

# Update parish
@router.put("/{parish_id}", response_model=schemas.ParishResponse)
async def update_parish(
    parish_id: int,
    parish_update: schemas.ParishCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Update a parish (archbishop only)"""
    if current_user.role.value != "ARCHBISHOP":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop can update parishes"
        )
    
    db_parish = db.query(models.Parish).filter(models.Parish.id == parish_id).first()
    if not db_parish:
        raise HTTPException(status_code=404, detail="Parish not found")
    
    # Update fields
    for key, value in parish_update.dict(exclude_unset=True).items():
        setattr(db_parish, key, value)
    
    db.commit()
    db.refresh(db_parish)
    
    return db_parish

# Delete parish
@router.delete("/{parish_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_parish(
    parish_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Delete a parish (archbishop only)"""
    if current_user.role.value != "ARCHBISHOP":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the Archbishop can delete parishes"
        )
    
    db_parish = db.query(models.Parish).filter(models.Parish.id == parish_id).first()
    if not db_parish:
        raise HTTPException(status_code=404, detail="Parish not found")
    
    # Check if parish has members
    member_count = db.query(models.User).filter(models.User.parish_id == parish_id).count()
    if member_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete parish with existing members. Reassign members first."
        )
    
    db.delete(db_parish)
    db.commit()