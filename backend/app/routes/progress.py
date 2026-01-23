from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime
from app.schemas.circuit import (
    LearningProgressCreate, LearningProgressUpdate, LearningProgressOut,
    AchievementCreate, AchievementOut
)
from app.models.circuit import LearningProgress, Achievement
from app.models.user import User
from app.database import get_db
from app.utils.auth import get_current_active_user

router = APIRouter()

# Learning Progress Endpoints
@router.post("/progress", response_model=LearningProgressOut)
def create_or_update_progress(
    body: LearningProgressCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create or update learning progress for a lesson."""
    # Check if progress already exists
    progress = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id,
        LearningProgress.path_id == body.path_id,
        LearningProgress.lesson_id == body.lesson_id
    ).first()
    
    if progress:
        # Update existing progress
        progress.status = body.status
        if body.quiz_score is not None:
            progress.quiz_score = body.quiz_score
        if body.status == "completed" and not progress.completed_at:
            progress.completed_at = datetime.utcnow()
    else:
        # Create new progress
        progress = LearningProgress(
            user_id=current_user.id,
            path_id=body.path_id,
            lesson_id=body.lesson_id,
            status=body.status,
            quiz_score=body.quiz_score,
            completed_at=datetime.utcnow() if body.status == "completed" else None
        )
        db.add(progress)
    
    db.commit()
    db.refresh(progress)
    return progress

@router.get("/progress", response_model=List[LearningProgressOut])
def get_user_progress(
    path_id: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all learning progress for the current user."""
    query = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id
    )
    
    if path_id:
        query = query.filter(LearningProgress.path_id == path_id)
    
    progress = query.all()
    return progress

@router.get("/progress/{lesson_id}", response_model=LearningProgressOut)
def get_lesson_progress(
    lesson_id: str,
    path_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get progress for a specific lesson."""
    progress = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id,
        LearningProgress.path_id == path_id,
        LearningProgress.lesson_id == lesson_id
    ).first()
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    return progress

@router.patch("/progress/{lesson_id}", response_model=LearningProgressOut)
def update_progress(
    lesson_id: str,
    path_id: str,
    body: LearningProgressUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update progress for a specific lesson."""
    progress = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id,
        LearningProgress.path_id == path_id,
        LearningProgress.lesson_id == lesson_id
    ).first()
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    if body.status is not None:
        progress.status = body.status
    if body.quiz_score is not None:
        progress.quiz_score = body.quiz_score
    if body.completed_at is not None:
        progress.completed_at = body.completed_at
    
    db.commit()
    db.refresh(progress)
    return progress

# Achievement Endpoints
@router.post("/achievements", response_model=AchievementOut)
def unlock_achievement(
    body: AchievementCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Unlock an achievement for the current user."""
    # Check if achievement already exists
    existing = db.query(Achievement).filter(
        Achievement.user_id == current_user.id,
        Achievement.achievement_id == body.achievement_id
    ).first()
    
    if existing:
        return existing
    
    achievement = Achievement(
        user_id=current_user.id,
        achievement_id=body.achievement_id,
        achievement_name=body.achievement_name,
        achievement_description=body.achievement_description,
        points=body.points
    )
    
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement

@router.get("/achievements", response_model=List[AchievementOut])
def get_user_achievements(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all achievements for the current user."""
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).order_by(Achievement.unlocked_at.desc()).all()
    
    return achievements

@router.get("/achievements/stats")
def get_achievement_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get achievement statistics for the current user."""
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).all()
    
    total_points = sum(a.points for a in achievements)
    total_achievements = len(achievements)
    
    return {
        "total_achievements": total_achievements,
        "total_points": total_points,
        "achievements": [a.achievement_id for a in achievements]
    }
