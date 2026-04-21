from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    ARCHBISHOP = "ARCHBISHOP"
    AUXILIARY_BISHOP = "AUXILIARY_BISHOP"
    CHANCELLOR = "CHANCELLOR"
    FINANCE_ADMIN = "FINANCE_ADMIN"
    DEAN = "DEAN"
    PARISH_SECRETARY = "PARISH_SECRETARY"
    PRIEST = "PRIEST"
    LAITY = "LAITY"

class EventType(str, enum.Enum):
    CLERGY = "clergy"
    YOUTH = "youth"
    WORSHIP = "worship"
    GENERAL = "general"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.LAITY)
    parish_id = Column(Integer, ForeignKey("parishes.id"), nullable=True)
    deanery_id = Column(Integer, ForeignKey("deaneries.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Parish(Base):
    __tablename__ = "parishes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    priest_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    deanery = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Deanery(Base):
    __tablename__ = "deaneries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    dean_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    date = Column(DateTime, nullable=False)
    time = Column(String, nullable=True)
    location = Column(String, nullable=True)
    parish_id = Column(Integer, ForeignKey("parishes.id"), nullable=True)
    event_type = Column(Enum(EventType), nullable=False, default=EventType.GENERAL)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_archdiocesan = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class SacramentRecord(Base):
    __tablename__ = "sacrament_records"

    id = Column(Integer, primary_key=True, index=True)
    member_name = Column(String, nullable=False)
    sacrament_type = Column(String, nullable=False)
    date_received = Column(DateTime, nullable=False)
    parish_id = Column(Integer, ForeignKey("parishes.id"), nullable=False)
    administered_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    parish_id = Column(Integer, ForeignKey("parishes.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    priority = Column(String, default="normal")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())