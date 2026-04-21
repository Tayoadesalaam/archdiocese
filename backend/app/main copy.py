from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, events, users, parishes, sacraments, announcements, priests
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Archdiocese of Abuja API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(parishes.router, prefix="/api")
app.include_router(sacraments.router, prefix="/api")
app.include_router(announcements.router, prefix="/api")
app.include_router(priests.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Archdiocese of Abuja API", "status": "running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}