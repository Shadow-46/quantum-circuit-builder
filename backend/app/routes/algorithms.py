from fastapi import APIRouter

router = APIRouter()

ALGORITHMS = {
    "deutsch-jozsa": {"name": "Deutsch–Jozsa", "difficulty": "intermediate"},
    "grover": {"name": "Grover's search", "difficulty": "advanced"},
}
@router.get("/")
def list_algorithms():
    return ALGORITHMS
