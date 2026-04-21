from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/parishes", tags=["parishes"])

# GET all parishes - PUBLIC
@router.get("/", response_model=List[schemas.ParishResponse])
async def get_parishes(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1)
):
    parishes = db.query(models.Parish).offset(skip).limit(limit).all()
    
    result = []
    for parish in parishes:
        priest_name = None
        if parish.priest_id:
            priest = db.query(models.User).filter(models.User.id == parish.priest_id).first()
            if priest:
                priest_name = f"Fr. {priest.first_name} {priest.last_name}"
        
        member_count = db.query(models.User).filter(models.User.parish_id == parish.id).count()
        
        result.append({
            "id": parish.id,
            "name": parish.name,
            "location": parish.location,
            "priest_id": parish.priest_id,
            "priest_name": priest_name,
            "deanery": parish.deanery,
            "phone": parish.phone,
            "email": parish.email,
            "member_count": member_count,
            "created_at": parish.created_at
        })
    
    return result

# GET single parish
@router.get("/{parish_id}", response_model=schemas.ParishResponse)
async def get_parish(
    parish_id: int,
    db: Session = Depends(get_db)
):
    parish = db.query(models.Parish).filter(models.Parish.id == parish_id).first()
    if not parish:
        raise HTTPException(status_code=404, detail="Parish not found")
    
    priest_name = None
    if parish.priest_id:
        priest = db.query(models.User).filter(models.User.id == parish.priest_id).first()
        if priest:
            priest_name = f"Fr. {priest.first_name} {priest.last_name}"
    
    member_count = db.query(models.User).filter(models.User.parish_id == parish.id).count()
    
    return {
        "id": parish.id,
        "name": parish.name,
        "location": parish.location,
        "priest_id": parish.priest_id,
        "priest_name": priest_name,
        "deanery": parish.deanery,
        "phone": parish.phone,
        "email": parish.email,
        "member_count": member_count,
        "created_at": parish.created_at
    }

# CREATE new parish
@router.post("/", response_model=schemas.ParishResponse, status_code=status.HTTP_201_CREATED)
async def create_parish(
    parish: schemas.ParishCreate,
    db: Session = Depends(get_db)
):
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

# UPDATE parish
@router.put("/{parish_id}", response_model=schemas.ParishResponse)
async def update_parish(
    parish_id: int,
    parish_update: schemas.ParishCreate,
    db: Session = Depends(get_db)
):
    db_parish = db.query(models.Parish).filter(models.Parish.id == parish_id).first()
    if not db_parish:
        raise HTTPException(status_code=404, detail="Parish not found")
    
    db_parish.name = parish_update.name
    db_parish.location = parish_update.location
    db_parish.priest_id = parish_update.priest_id
    db_parish.deanery = parish_update.deanery
    db_parish.phone = parish_update.phone
    db_parish.email = parish_update.email
    
    db.commit()
    db.refresh(db_parish)
    
    return db_parish

# DELETE parish
@router.delete("/{parish_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_parish(
    parish_id: int,
    db: Session = Depends(get_db)
):
    db_parish = db.query(models.Parish).filter(models.Parish.id == parish_id).first()
    if not db_parish:
        raise HTTPException(status_code=404, detail="Parish not found")
    
    db.delete(db_parish)
    db.commit()