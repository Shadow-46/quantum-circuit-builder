# System Architecture

## Overview

Quantum Circuit Builder is a full-stack web application built with modern technologies, providing a comprehensive platform for quantum circuit design, simulation, and collaboration.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │   Zustand    │  │   Axios      │      │
│  │  Components  │  │  State Mgmt  │  │  HTTP Client │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
         HTTP/REST                     WebSocket
              │                             │
┌─────────────┼─────────────────────────────┼─────────────────┐
│             │        Backend              │                 │
│     ┌───────▼───────┐          ┌──────────▼──────────┐      │
│     │   FastAPI     │          │   Socket.IO Server  │      │
│     │  REST Routes  │          │   Real-time Collab  │      │
│     └───────┬───────┘          └──────────┬──────────┘      │
│             │                             │                 │
│     ┌───────▼────────────────────────────▼────────┐         │
│     │         SQLAlchemy ORM                      │         │
│     │   (User, Circuit, Version, Comments, etc.)  │         │
│     └───────┬─────────────────────────────────────┘         │
│             │                                               │
│     ┌───────▼────────┐      ┌──────────────────┐          │
│     │   SQLite/      │      │   Qiskit Engine  │          │
│     │   PostgreSQL   │      │   Simulation     │          │
│     └────────────────┘      └──────────────────┘          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Structure

### Frontend (`/frontend`)

```
src/
├── components/           # React components
│   ├── CircuitBuilder/   # Main circuit interface
│   │   ├── CircuitCanvas.jsx
│   │   ├── GatePalette.jsx
│   │   └── CircuitActions.jsx
│   ├── Visualizations/   # Simulation results
│   │   └── MeasurementChart.jsx
│   ├── Collaboration/    # Real-time features
│   │   ├── CollaborationPanel.jsx
│   │   └── LiveCursors.jsx
│   ├── Common/           # Shared components
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   └── LoadingSpinner.jsx
│   └── Developer/        # API management
│       └── APIKeyManager.jsx
├── pages/                # Route pages
│   ├── HomePage.jsx
│   └── BuilderPage.jsx
├── services/             # API clients
│   ├── api.js            # REST API client
│   └── websocket.js      # WebSocket client
├── store/                # State management
│   └── circuitStore.js   # Zustand store
└── styles/               # CSS modules
    └── components.css
```

### Backend (`/backend`)

```
app/
├── main.py               # FastAPI application entry
├── config.py             # Configuration settings
├── websocket.py          # Socket.IO server
├── models/               # SQLAlchemy models
│   ├── user.py           # User authentication
│   ├── circuit.py        # Circuit storage
│   ├── api_key.py        # API key management
│   ├── comment.py        # Circuit comments
│   ├── learning.py       # Progress tracking
│   └── achievement.py    # Badge system
├── routes/               # API endpoints
│   ├── auth.py           # Login/register
│   ├── circuits.py       # Circuit CRUD
│   ├── api_keys.py       # API key management
│   ├── progress.py       # Learning progress
│   └── simulate.py       # Simulation
├── schemas/              # Pydantic models
│   ├── user.py           # User schemas
│   └── circuit.py        # Circuit schemas
├── services/             # Business logic
│   └── simulator.py      # Quantum simulation
└── utils/                # Utilities
    ├── constants.py      # Constants
    └── rate_limit.py     # Rate limiting
```

---

## 🔄 Data Flow

### Circuit Creation Flow

```
1. User drags gate from palette
   ↓
2. Frontend updates Zustand store
   ↓
3. Component re-renders with new gate
   ↓
4. User clicks "Simulate"
   ↓
5. POST /api/simulate with circuit data
   ↓
6. Backend parses circuit
   ↓
7. Qiskit creates QuantumCircuit
   ↓
8. Simulation runs (1024 shots)
   ↓
9. Results returned to frontend
   ↓
10. Measurement chart displays results
```

### Real-Time Collaboration Flow

```
1. User A joins circuit room
   ↓
2. WebSocket connection established
   ↓
3. Socket.IO broadcasts "user_joined"
   ↓
4. User B receives notification
   ↓
5. User A adds gate
   ↓
6. Frontend emits "gate_added" event
   ↓
7. Backend broadcasts to all in room
   ↓
8. User B receives event
   ↓
9. User B's circuit updates in real-time
   ↓
10. Live cursors show User A's position
```

### API Request Flow

```
1. External app sends request with API key
   ↓
2. Rate limiting middleware checks quota
   ↓
3. API key verified against database
   ↓
4. Request processed by route handler
   ↓
5. Database query executed (if needed)
   ↓
6. Response formatted and returned
   ↓
7. Usage logged to api_usage table
   ↓
8. API key last_used_at updated
```

---

## 🗄️ Database Schema

### Core Models

**User**
- `id` (UUID, PK)
- `email` (String, unique)
- `username` (String, unique)
- `password_hash` (String)
- `avatar_url` (String)
- `created_at` (DateTime)

**Circuit**
- `id` (UUID, PK)
- `user_id` (UUID, FK → User)
- `name` (String)
- `description` (Text)
- `circuit_data` (JSONB)
- `visibility` (Enum: public/unlisted/private)
- `created_at`, `updated_at` (DateTime)

**APIKey**
- `id` (UUID, PK)
- `user_id` (UUID, FK → User)
- `name` (String)
- `key_prefix` (String, indexed)
- `key_hash` (String)
- `rate_limit` (Integer)
- `is_active` (Boolean)
- `expires_at` (DateTime, nullable)

**APIUsage**
- `id` (UUID, PK)
- `api_key_id` (UUID, FK → APIKey)
- `endpoint` (String)
- `method` (String)
- `status_code` (Integer)
- `response_time_ms` (Integer)
- `timestamp` (DateTime)

### Relationships

```
User ──< Circuit (one-to-many)
User ──< APIKey (one-to-many)
APIKey ──< APIUsage (one-to-many)
Circuit ──< CircuitVersion (one-to-many)
Circuit ──< Comment (one-to-many)
```

---

## 🔐 Security Architecture

### Authentication

1. **Registration**
   - Password hashed with bcrypt (cost factor: 12)
   - Stored in `password_hash` field
   - Email uniqueness validated

2. **Login**
   - Credentials verified against hash
   - JWT token generated (expires in 7 days)
   - Token contains: user_id, email, exp

3. **Protected Routes**
   - JWT token required in Authorization header
   - Middleware validates and decodes token
   - User object attached to request

### API Key Security

1. **Generation**
   - Format: `qcb_` + 32 random bytes (hex)
   - Example: `qcb_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

2. **Storage**
   - Only key prefix stored in plain text (`qcb_XXXXXXXX`)
   - Full key hashed with bcrypt before storage
   - Original key shown only once at creation

3. **Verification**
   - Lookup by key prefix (fast index)
   - Verify full key against bcrypt hash
   - Check expiration and active status

### Rate Limiting

1. **Implementation**
   - In-memory cache: `Dict[key_id, List[timestamp]]`
   - Rolling 1-hour window
   - Configurable per key (100-10,000 req/hr)

2. **Process**
   ```python
   1. Extract API key from request
   2. Get request timestamps for key
   3. Remove timestamps older than 1 hour
   4. Check count against limit
   5. Add current timestamp if under limit
   6. Return 429 if over limit
   ```

3. **Production Recommendation**
   - Use Redis for distributed rate limiting
   - Implement token bucket algorithm
   - Add IP-based rate limiting

---

## 🚀 Performance Optimizations

### Frontend

1. **Code Splitting**
   - Lazy loading with React.lazy()
   - Route-based code splitting
   - Reduced initial bundle size

2. **State Management**
   - Zustand for minimal re-renders
   - Selective subscriptions
   - Persistent state in localStorage

3. **Asset Optimization**
   - Vite for fast HMR
   - CSS minification
   - Tree-shaking unused code

### Backend

1. **Database**
   - Indexed columns (email, key_prefix)
   - Eager loading for relationships
   - Connection pooling

2. **API**
   - FastAPI async/await support
   - Uvicorn ASGI server
   - Response caching (planned)

3. **WebSocket**
   - Room-based message broadcasting
   - Efficient JSON serialization
   - Connection pooling

---

## 📊 Monitoring & Observability

### Logging

```python
# Structured logging
import logging

logger.info("Circuit simulated", extra={
    "circuit_id": circuit.id,
    "user_id": user.id,
    "shots": 1024,
    "execution_time_ms": 245
})
```

### Metrics (Planned)

- Request latency (p50, p95, p99)
- API key usage by endpoint
- WebSocket active connections
- Simulation execution time
- Database query performance

### Error Tracking (Planned)

- Sentry integration
- Error rate monitoring
- Stack trace capture
- User context attachment

---

## 🔄 Deployment Architecture

### Development

```
Frontend: Vite dev server (port 5173)
Backend: Uvicorn (port 8000)
Database: SQLite file
WebSocket: Integrated with FastAPI
```

### Production (Recommended)

```
┌─────────────────┐
│   Load Balancer │
│   (Nginx/ALB)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ App 1 │ │ App 2 │  (FastAPI + Frontend build)
└───┬───┘ └──┬────┘
    │        │
    └────┬───┘
         │
┌────────▼─────────┐
│   PostgreSQL     │
│   (Managed RDS)  │
└──────────────────┘
         │
┌────────▼─────────┐
│   Redis          │
│   (Rate Limit)   │
└──────────────────┘
```

### Containerization (Docker)

```dockerfile
# Frontend
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

---

## 🧪 Testing Strategy

### Frontend Tests (Planned)

- **Unit Tests:** Vitest/Jest
  - Component logic
  - Store mutations
  - Utility functions

- **Integration Tests:** React Testing Library
  - User interactions
  - API integration
  - WebSocket events

- **E2E Tests:** Playwright/Cypress
  - Circuit creation flow
  - Authentication flow
  - Collaboration features

### Backend Tests (Planned)

- **Unit Tests:** Pytest
  - Business logic
  - Utility functions
  - Model validations

- **Integration Tests:** Pytest + FastAPI TestClient
  - API endpoints
  - Database operations
  - Authentication

- **Load Tests:** Locust
  - API throughput
  - WebSocket scalability
  - Database performance

---

## 📈 Scalability Considerations

### Horizontal Scaling

1. **Stateless Backend**
   - JWT authentication (no server sessions)
   - Redis for shared state
   - S3 for file storage

2. **WebSocket Scaling**
   - Redis pub/sub for message broadcasting
   - Sticky sessions for load balancer
   - Socket.IO Redis adapter

3. **Database Scaling**
   - Read replicas for queries
   - Write to primary only
   - Connection pooling

### Vertical Scaling

- Increase worker processes (Uvicorn)
- Optimize database queries
- Add caching layer (Redis)
- CDN for static assets

---

## 🔮 Future Enhancements

### Short Term
- [ ] Comprehensive test suite
- [ ] Redis integration for rate limiting
- [ ] Email verification
- [ ] OAuth providers (Google, GitHub)

### Medium Term
- [ ] GraphQL endpoint
- [ ] Advanced analytics dashboard
- [ ] Team workspaces
- [ ] Mobile responsive improvements

### Long Term
- [ ] Native mobile apps (React Native)
- [ ] Kubernetes orchestration
- [ ] Multi-region deployment
- [ ] ML-based circuit optimization

---

**Last Updated:** January 26, 2026  
**Architecture Version:** 3.0  
**Maintained by:** Quantum Circuit Builder Team
