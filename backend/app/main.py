from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from app.config import settings
from app.routes import circuit, simulate, algorithms, export, auth, progress, api_keys
from app.database import engine, Base
from app.websocket import sio

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Quantum Circuit Builder API",
    version="2.0.0",
    description="""
    🚀 **Quantum Circuit Builder REST API**
    
    Build, simulate, and share quantum circuits with ease.
    
    ## Features
    
    * 🔐 **Authentication** - Secure JWT-based user authentication
    * ⚛️ **Circuit Management** - Create, update, and share quantum circuits
    * 🔬 **Simulation** - Run quantum simulations with Qiskit
    * 📊 **Algorithms** - Access pre-built quantum algorithms
    * 🎓 **Learning** - Track progress through learning paths
    * 🔑 **API Keys** - Generate keys for programmatic access
    * 💬 **Real-time Collaboration** - WebSocket-based live editing
    
    ## Authentication
    
    Two authentication methods:
    
    1. **JWT Tokens** - For web app users
       - Obtain token via `/api/auth/login`
       - Include in header: `Authorization: Bearer <token>`
    
    2. **API Keys** - For programmatic access
       - Generate via `/api/api-keys`
       - Include in header: `Authorization: qcb_<your_key>`
    
    ## Rate Limits
    
    - Default: 1000 requests/hour per API key
    - Configurable per key
    
    ## Support
    
    - Documentation: https://docs.example.com
    - GitHub: https://github.com/quantum-circuit-builder
    """,
    contact={
        "name": "Quantum Circuit Builder Team",
        "url": "https://github.com/quantum-circuit-builder",
        "email": "support@quantumcircuitbuilder.com"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Socket.IO
socket_app = socketio.ASGIApp(sio, app)

# API routes
app.include_router(auth.router, prefix="/api", tags=["🔐 Authentication"])
app.include_router(api_keys.router, prefix="/api", tags=["🔑 API Keys"])
app.include_router(circuit.router, prefix="/api/circuits", tags=["⚛️ Circuits"])
app.include_router(simulate.router, prefix="/api/simulate", tags=["🔬 Simulation"])
app.include_router(algorithms.router, prefix="/api/algorithms", tags=["📊 Algorithms"])
app.include_router(export.router, prefix="/api/export", tags=["💾 Export"])
app.include_router(progress.router, prefix="/api/learning", tags=["🎓 Learning"])

# Public API v1 routes (API key authenticated)
app.include_router(circuit.router, prefix="/api/v1/circuits", tags=["🌐 Public API - Circuits"])
app.include_router(simulate.router, prefix="/api/v1/simulate", tags=["🌐 Public API - Simulation"])
app.include_router(algorithms.router, prefix="/api/v1/algorithms", tags=["🌐 Public API - Algorithms"])

@app.get("/health", tags=["Health"])
def health():
    """Health check endpoint"""
    return {"status": "ok", "version": "2.0.0"}

@app.get("/", tags=["Info"])
def root():
    """API information"""
    return {
        "name": "Quantum Circuit Builder API",
        "version": "2.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Export the socket_app for uvicorn
application = socket_app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host=settings.BACKEND_HOST, port=settings.BACKEND_PORT, reload=True)
