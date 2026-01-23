from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from ..database import Base

class VisibilityEnum(str, enum.Enum):
    PRIVATE = "private"
    UNLISTED = "unlisted"
    PUBLIC = "public"

class Circuit(Base):
    __tablename__ = "circuits"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    num_qubits = Column(Integer, nullable=False)
    circuit_data = Column(JSON, nullable=False)  # Stores gates array and other circuit info
    visibility = Column(Enum(VisibilityEnum), default=VisibilityEnum.PRIVATE)
    tags = Column(JSON, default=list)  # Array of tags
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="circuits")
    versions = relationship("CircuitVersion", back_populates="circuit", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="circuit", cascade="all, delete-orphan")

class CircuitVersion(Base):
    __tablename__ = "circuit_versions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    circuit_id = Column(String, ForeignKey("circuits.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    commit_message = Column(String, nullable=False)
    circuit_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    circuit = relationship("Circuit", back_populates="versions")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    circuit_id = Column(String, ForeignKey("circuits.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    position_x = Column(Integer, nullable=True)  # Position on circuit canvas
    position_y = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    circuit = relationship("Circuit", back_populates="comments")
    user = relationship("User", back_populates="comments")

class LearningProgress(Base):
    __tablename__ = "learning_progress"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    path_id = Column(String, nullable=False)
    lesson_id = Column(String, nullable=False)
    status = Column(String, nullable=False)  # locked, available, in_progress, completed
    quiz_score = Column(Integer, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="learning_progress")

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(String, nullable=False)
    achievement_name = Column(String, nullable=False)
    achievement_description = Column(Text, nullable=True)
    points = Column(Integer, default=0)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="achievements")
