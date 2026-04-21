from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    ARCHBISHOP = "ARCHBISHOP"
    AUXILIARY_BISHOP = "AUXILIARY_BISHOP"
    CHANCELLOR = "CHANCELLOR"
    FINANCE_ADMIN = "FINANCE_ADMIN"
    DEAN = "DEAN"
    PARISH_SECRETARY = "PARISH_SECRETARY"
    PRIEST = "PRIEST"
    LAITY = "LAITY"

class EventType(str, Enum):
    CLERGY = "clergy"
    YOUTH = "youth"
    WORSHIP = "worship"
    GENERAL = "general"

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: UserRole = UserRole.LAITY
    parish_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    parish_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    role: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class TokenData(BaseModel):
    username: Optional[str] = None

# Event Schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    time: Optional[str] = None
    location: Optional[str] = None
    parish_id: Optional[int] = None
    event_type: EventType = EventType.GENERAL
    is_archdiocesan: bool = False

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    time: Optional[str] = None
    location: Optional[str] = None
    event_type: Optional[EventType] = None

class EventResponse(EventBase):
    id: int
    created_by: int
    created_at: datetime
    parish_name: Optional[str] = None
    creator_name: Optional[str] = None

    class Config:
        from_attributes = True

# Parish Schemas
class ParishBase(BaseModel):
    name: str
    location: str
    priest_id: Optional[int] = None
    deanery: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class ParishCreate(ParishBase):
    pass

class ParishResponse(ParishBase):
    id: int
    priest_name: Optional[str] = None
    member_count: Optional[int] = 0
    created_at: datetime

    class Config:
        from_attributes = True

# Sacrament Record Schemas
class SacramentRecordBase(BaseModel):
    member_name: str
    sacrament_type: str
    date_received: datetime
    parish_id: int
    administered_by: Optional[int] = None

class SacramentRecordCreate(SacramentRecordBase):
    pass

class SacramentRecordResponse(SacramentRecordBase):
    id: int
    created_at: datetime
    parish_name: Optional[str] = None
    minister_name: Optional[str] = None

    class Config:
        from_attributes = True

# Announcement Schemas
class AnnouncementBase(BaseModel):
    title: str
    content: str
    parish_id: Optional[int] = None
    priority: str = "normal"

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementResponse(AnnouncementBase):
    id: int
    created_by: int
    created_at: datetime
    parish_name: Optional[str] = None
    creator_name: Optional[str] = None

    class Config:
        from_attributes = True

# Deanery Schemas
class DeaneryBase(BaseModel):
    name: str
    location: Optional[str] = None
    description: Optional[str] = None
    dean_id: Optional[int] = None

class DeaneryCreate(DeaneryBase):
    pass

class DeaneryResponse(DeaneryBase):
    id: int
    created_at: datetime
    parish_count: Optional[int] = 0

    class Config:
        from_attributes = True