from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app import models, schemas, auth
from app.database import get_db
from sqlalchemy import or_

router = APIRouter(prefix="/events", tags=["events"])

# GET all events - PUBLIC for viewing
@router.get("/", response_model=List[schemas.EventResponse])
async def get_events(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    event_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    query = db.query(models.Event)
    
    if event_type:
        query = query.filter(models.Event.event_type == event_type)
    
    if start_date:
        query = query.filter(models.Event.date >= start_date)
    
    if end_date:
        query = query.filter(models.Event.date <= end_date)

    query = query.order_by(models.Event.date.desc())
    events = query.offset(skip).limit(limit).all()
    
    result = []
    for event in events:
        # Get parish name
        parish_name = None
        if event.parish_id:
            parish = db.query(models.Parish).filter(models.Parish.id == event.parish_id).first()
            if parish:
                parish_name = parish.name
        
        # Get creator name
        creator_name = None
        if event.created_by:
            creator = db.query(models.User).filter(models.User.id == event.created_by).first()
            if creator:
                creator_name = f"{creator.first_name} {creator.last_name}"
        
        result.append({
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "time": event.time,
            "location": event.location,
            "parish_id": event.parish_id,
            "event_type": event.event_type.value if event.event_type else "general",
            "is_archdiocesan": event.is_archdiocesan,
            "created_by": event.created_by,
            "created_at": event.created_at,
            "parish_name": parish_name,
            "creator_name": creator_name
        })
    
    return result

# POST create new event (requires login)
@router.post("/", response_model=schemas.EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_event = models.Event(
        title=event.title,
        description=event.description,
        date=event.date,
        time=event.time,
        location=event.location,
        parish_id=event.parish_id,
        event_type=event.event_type,
        is_archdiocesan=event.is_archdiocesan,
        created_by=current_user.id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    return db_event

# GET single event
@router.get("/{event_id}", response_model=schemas.EventResponse)
async def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    parish_name = None
    if event.parish_id:
        parish = db.query(models.Parish).filter(models.Parish.id == event.parish_id).first()
        if parish:
            parish_name = parish.name
    
    creator_name = None
    if event.created_by:
        creator = db.query(models.User).filter(models.User.id == event.created_by).first()
        if creator:
            creator_name = f"{creator.first_name} {creator.last_name}"
    
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "date": event.date,
        "time": event.time,
        "location": event.location,
        "parish_id": event.parish_id,
        "event_type": event.event_type.value if event.event_type else "general",
        "is_archdiocesan": event.is_archdiocesan,
        "created_by": event.created_by,
        "created_at": event.created_at,
        "parish_name": parish_name,
        "creator_name": creator_name
    }