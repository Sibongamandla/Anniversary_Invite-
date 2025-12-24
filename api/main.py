from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import csv
import io

import os
from . import crud, models, schemas, database, auth
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

# On Vercel, requests to /api/xyz are rewritten to this app.
# FastAPI needs to know it's mounted at /api so it can parse routes correctly.
root_path = "/api" if os.getenv("VERCEL") else ""

app = FastAPI(title="Wedding Anniversary API", root_path=root_path)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Wedding Anniversary API"}

@app.get("/debug-db")
def debug_db(db: Session = Depends(get_db)):
    try:
        admin_count = db.query(models.Admin).count()
        return {"status": "connected", "admin_count": admin_count}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# CORS setup
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
    "*"  # Allow all for dev debugging
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Auth ---

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    username = auth.verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_admin_by_username(db, username=username)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- Guests ---

@app.post("/guests/", response_model=schemas.Guest)
def create_guest(guest: schemas.GuestCreate, db: Session = Depends(get_db), current_user: models.Admin = Depends(get_current_user)):
    return crud.create_guest(db=db, guest=guest)

@app.get("/guests/", response_model=List[schemas.Guest])
def read_guests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.Admin = Depends(get_current_user)):
    guests = crud.get_guests(db, skip=skip, limit=limit)
    return guests

@app.post("/guests/upload-csv")
async def upload_guests_csv(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.Admin = Depends(get_current_user)):
    contents = await file.read()
    decoded = contents.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(decoded))
    
    guests_added = 0
    for row in csv_reader:
        if 'name' in row and 'phone_number' in row:
            guest_data = schemas.GuestCreate(name=row['name'], phone_number=row['phone_number'])
            crud.create_guest(db, guest_data)
            guests_added += 1
            
    return {"message": f"Successfully added {guests_added} guests"}

# --- Public RSVP ---

@app.get("/rsvp/{unique_code}", response_model=schemas.Guest)
def check_code(unique_code: str, db: Session = Depends(get_db)):
    guest = crud.get_guest_by_code(db, unique_code=unique_code)
    if not guest:
        raise HTTPException(status_code=404, detail="Invalid invitation code")
    return guest

@app.post("/rsvp/{unique_code}", response_model=schemas.Guest)
def submit_rsvp(unique_code: str, rsvp: schemas.GuestRSVPUpdate, db: Session = Depends(get_db)): # Fixed Schema name typo
    guest = crud.get_guest_by_code(db, unique_code=unique_code)
    if not guest:
         raise HTTPException(status_code=404, detail="Invalid invitation code")
    
    if guest.rsvp_status != "pending" and guest.rsvp_status != rsvp.rsvp_status:
         # Optional: Allow updating RSVP? Or once set it's done? User said:
         # "Check if the code has already been used (to prevent double-submissions)."
         # I'll implement a check.
         if guest.rsvp_status != "pending":
             raise HTTPException(status_code=400, detail="RSVP already submitted")

    return crud.update_guest_rsvp(db, unique_code=unique_code, rsvp_status=rsvp.rsvp_status, notes=rsvp.notes,
                                  email=rsvp.email, is_family=rsvp.is_family, plus_one_count=rsvp.plus_one_count, dietary_restrictions=rsvp.dietary_restrictions)

# --- Admin Setup (Development convenience) ---
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    if not crud.get_admin_by_username(db, "admin"):
        # Create a default admin
        default_admin = schemas.AdminCreate(username="admin", password="password123")
        crud.create_admin(db, default_admin)
        print("Created default admin user: admin / password123")
