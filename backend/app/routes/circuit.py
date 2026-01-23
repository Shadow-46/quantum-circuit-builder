from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime
from app.schemas.circuit import (
    CircuitCreate, CircuitOut, CircuitUpdate, CircuitVersionCreate, 
    CircuitVersionOut, CommentCreate, CommentOut
)
from app.models.circuit import Circuit, CircuitVersion, Comment, VisibilityEnum
from app.models.user import User
from app.database import get_db
from app.utils.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=CircuitOut)
def create_circuit(
    body: CircuitCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new circuit for the authenticated user."""
    circuit_data = {
        "num_qubits": body.num_qubits,
        "gates": [g.model_dump() for g in body.gates]
    }
    
    circuit = Circuit(
        user_id=current_user.id,
        name=body.name,
        description=body.description,
        num_qubits=body.num_qubits,
        circuit_data=circuit_data,
        visibility=body.visibility,
        tags=body.tags or []
    )
    
    db.add(circuit)
    db.commit()
    db.refresh(circuit)
    return circuit

@router.get("/", response_model=List[CircuitOut])
def list_circuits(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    visibility: Optional[str] = None,
    tags: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List circuits. Shows user's own circuits + public circuits."""
    query = db.query(Circuit)
    
    # Filter by visibility and ownership
    if current_user:
        # Show user's own circuits OR public circuits
        query = query.filter(
            (Circuit.user_id == current_user.id) | 
            (Circuit.visibility == VisibilityEnum.PUBLIC)
        )
    else:
        # Only show public circuits for unauthenticated users
        query = query.filter(Circuit.visibility == VisibilityEnum.PUBLIC)
    
    # Additional filters
    if visibility:
        query = query.filter(Circuit.visibility == visibility)
    
    if tags:
        tag_list = tags.split(",")
        for tag in tag_list:
            query = query.filter(Circuit.tags.contains([tag]))
    
    circuits = query.offset(skip).limit(limit).all()
    return circuits

@router.get("/{circuit_id}", response_model=CircuitOut)
def get_circuit(
    circuit_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    """Get a specific circuit by ID."""
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    # Check permissions
    if circuit.visibility == VisibilityEnum.PRIVATE:
        if not current_user or circuit.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return circuit

@router.put("/{circuit_id}", response_model=CircuitOut)
def update_circuit(
    circuit_id: str,
    body: CircuitUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a circuit. Only the owner can update."""
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    if circuit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update fields
    if body.name is not None:
        circuit.name = body.name
    if body.description is not None:
        circuit.description = body.description
    if body.circuit_data is not None:
        circuit.circuit_data = body.circuit_data
    if body.visibility is not None:
        circuit.visibility = body.visibility
    if body.tags is not None:
        circuit.tags = body.tags
    
    circuit.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(circuit)
    return circuit

@router.delete("/{circuit_id}")
def delete_circuit(
    circuit_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a circuit. Only the owner can delete."""
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    if circuit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db.delete(circuit)
    db.commit()
    return {"message": "Circuit deleted successfully"}

# Version control endpoints
@router.post("/{circuit_id}/versions", response_model=CircuitVersionOut)
def create_circuit_version(
    circuit_id: str,
    body: CircuitVersionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Save a new version of the circuit."""
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    if circuit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get the next version number
    max_version = db.query(CircuitVersion).filter(
        CircuitVersion.circuit_id == circuit_id
    ).count()
    
    version = CircuitVersion(
        circuit_id=circuit_id,
        version_number=max_version + 1,
        commit_message=body.commit_message,
        circuit_data=body.circuit_data
    )
    
    db.add(version)
    db.commit()
    db.refresh(version)
    return version

@router.get("/{circuit_id}/versions", response_model=List[CircuitVersionOut])
def list_circuit_versions(
    circuit_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all versions of a circuit."""
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    if circuit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    versions = db.query(CircuitVersion).filter(
        CircuitVersion.circuit_id == circuit_id
    ).order_by(CircuitVersion.version_number.desc()).all()
    
    return versions

# Comment endpoints
@router.post("/{circuit_id}/comments", response_model=CommentOut)
def create_comment(
    circuit_id: str,
    body: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a comment to a circuit."""
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    # Check if user can view the circuit
    if circuit.visibility == VisibilityEnum.PRIVATE and circuit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    comment = Comment(
        circuit_id=circuit_id,
        user_id=current_user.id,
        text=body.text,
        position_x=body.position_x,
        position_y=body.position_y
    )
    
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@router.get("/{circuit_id}/comments", response_model=List[CommentOut])
def list_comments(
    circuit_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    """List all comments for a circuit."""
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    # Check permissions
    if circuit.visibility == VisibilityEnum.PRIVATE:
        if not current_user or circuit.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    comments = db.query(Comment).filter(
        Comment.circuit_id == circuit_id
    ).order_by(Comment.created_at.desc()).all()
    
    return comments

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a comment. Only the author can delete."""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}
