from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/announcements", tags=["announcements"])

# GET all announcements
@router.get("/", response_model=List[schemas.AnnouncementResponse])
async def get_announcements(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1)
):
    query = db.query(models.Announcement).order_by(
        models.Announcement.priority.desc(),
        models.Announcement.created_at.desc()
    )
    
    announcements = query.offset(skip).limit(limit).all()
    
    result = []
    for ann in announcements:
        # Get parish name
        parish_name = None
        if ann.parish_id:
            parish = db.query(models.Parish).filter(models.Parish.id == ann.parish_id).first()
            if parish:
                parish_name = parish.name
        
        # Get creator name
        creator_name = None
        if ann.created_by:
            creator = db.query(models.User).filter(models.User.id == ann.created_by).first()
            if creator:
                creator_name = f"{creator.first_name} {creator.last_name}"
        
        result.append({
            "id": ann.id,
            "title": ann.title,
            "content": ann.content,
            "parish_id": ann.parish_id,
            "priority": ann.priority,
            "created_by": ann.created_by,
            "created_at": ann.created_at,
            "parish_name": parish_name,
            "creator_name": creator_name
        })
    
    return result

# POST create new announcement
@router.post("/", response_model=schemas.AnnouncementResponse, status_code=status.HTTP_201_CREATED)
async def create_announcement(
    announcement: schemas.AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_announcement = models.Announcement(
        title=announcement.title,
        content=announcement.content,
        parish_id=announcement.parish_id,
        priority=announcement.priority,
        created_by=current_user.id
    )
    
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    
    return db_announcement