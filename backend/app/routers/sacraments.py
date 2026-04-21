from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/sacraments", tags=["sacraments"])

# GET all sacraments
@router.get("/", response_model=List[schemas.SacramentRecordResponse])
async def get_sacraments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
    parish_id: Optional[int] = None,
    sacrament_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1)
):
    query = db.query(models.SacramentRecord)
    
    if parish_id:
        query = query.filter(models.SacramentRecord.parish_id == parish_id)
    
    if sacrament_type:
        query = query.filter(models.SacramentRecord.sacrament_type == sacrament_type)
    
    records = query.offset(skip).limit(limit).all()
    
    result = []
    for record in records:
        # Get parish name
        parish_name = None
        if record.parish_id:
            parish = db.query(models.Parish).filter(models.Parish.id == record.parish_id).first()
            if parish:
                parish_name = parish.name
        
        # Get minister name
        minister_name = None
        if record.administered_by:
            minister = db.query(models.User).filter(models.User.id == record.administered_by).first()
            if minister:
                minister_name = f"Fr. {minister.first_name} {minister.last_name}"
        
        result.append({
            "id": record.id,
            "member_name": record.member_name,
            "sacrament_type": record.sacrament_type,
            "date_received": record.date_received,
            "parish_id": record.parish_id,
            "administered_by": record.administered_by,
            "created_at": record.created_at,
            "parish_name": parish_name,
            "minister_name": minister_name
        })
    
    return result

# POST create new sacrament
@router.post("/", response_model=schemas.SacramentRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_sacrament(
    sacrament: schemas.SacramentRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_sacrament = models.SacramentRecord(
        member_name=sacrament.member_name,
        sacrament_type=sacrament.sacrament_type,
        date_received=sacrament.date_received,
        parish_id=sacrament.parish_id,
        administered_by=current_user.id
    )
    db.add(db_sacrament)
    db.commit()
    db.refresh(db_sacrament)
    
    return db_sacrament