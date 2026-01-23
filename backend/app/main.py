from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import circuit, simulate, algorithms, export, auth, progress
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Quantum Circuit Builder API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(circuit.router, prefix="/api/circuits", tags=["circuits"])
app.include_router(simulate.router, prefix="/api/simulate", tags=["simulate"])
app.include_router(algorithms.router, prefix="/api/algorithms", tags=["algorithms"])
app.include_router(export.router, prefix="/api/export", tags=["export"])
app.include_router(progress.router, prefix="/api/learning", tags=["learning"])

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.BACKEND_HOST, port=settings.BACKEND_PORT, reload=True)
