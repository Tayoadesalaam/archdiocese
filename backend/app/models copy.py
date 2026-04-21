from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    ARCHBISHOP = "ARCHBISHOP"
    AUXILIARY_BISHOP = "AUXILIARY_BISHOP"
    CHANCELLOR = "CHANCELLOR"
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
    deanery_id = Column(Integer, ForeignKey("deaneries.id"), nullable=True)  # Add this for Aux Bishop/Dean
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parish = relationship("Parish", foreign_keys=[parish_id], back_populates="members")
    deanery = relationship("Deanery", foreign_keys=[deanery_id])  # Add this
    parish_in_charge = relationship("Parish", foreign_keys="Parish.priest_id", back_populates="priest")
    events_created = relationship("Event", back_populates="creator")
    sacrament_records = relationship("SacramentRecord", back_populates="administered_by_user")

class Parish(Base):
    __tablename__ = "parishes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    priest_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    deanery_id = Column(Integer, ForeignKey("deaneries.id"), nullable=True)  # Add this
    phone = Column(String)
    email = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    priest = relationship("User", foreign_keys=[priest_id])
    deanery = relationship("Deanery", back_populates="parishes")
    members = relationship("User", foreign_keys="User.parish_id", back_populates="parish")
    events = relationship("Event", back_populates="parish")
    sacrament_records = relationship("SacramentRecord", back_populates="parish")
    
class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    date = Column(DateTime, nullable=False)
    time = Column(String)
    location = Column(String)
    parish_id = Column(Integer, ForeignKey("parishes.id"), nullable=True)
    event_type = Column(Enum(EventType), nullable=False, default=EventType.GENERAL)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_archdiocesan = Column(Boolean, default=False)
    is_recurring = Column(Boolean, default=False)  # For recurring events like daily mass
    recurrence_pattern = Column(String, nullable=True)  # daily, weekly, monthly
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parish = relationship("Parish", back_populates="events")
    creator = relationship("User", back_populates="events_created")

class SacramentRecord(Base):
    __tablename__ = "sacrament_records"

    id = Column(Integer, primary_key=True, index=True)
    member_name = Column(String, nullable=False)
    sacrament_type = Column(String, nullable=False)  # BAPTISM, MARRIAGE, CONFIRMATION, etc.
    date_received = Column(DateTime, nullable=False)
    parish_id = Column(Integer, ForeignKey("parishes.id"), nullable=False)
    administered_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    parish = relationship("Parish", back_populates="sacrament_records")
    administered_by_user = relationship("User", back_populates="sacrament_records")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    parish_id = Column(Integer, ForeignKey("parishes.id"), nullable=True)  # NULL = archdiocesan-wide
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    priority = Column(String, default="normal")  # high, normal
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parish = relationship("Parish")
    creator = relationship("User", foreign_keys=[created_by])

class Deanery(Base):
    __tablename__ = "deaneries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    description = Column(Text)
    dean_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    dean = relationship("User", foreign_keys=[dean_id])
    parishes = relationship("Parish", back_populates="deanery")