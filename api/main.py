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

@app.post("/guests/{unique_code}/mark-sent", response_model=schemas.Guest)
def mark_guest_invite_sent(unique_code: str, db: Session = Depends(get_db), current_user: models.Admin = Depends(get_current_user)):
    guest = crud.get_guest_by_code(db, unique_code)
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    # Toggle or set to true. Let's toggle for now to allow undo, or just set true.
    # User said "It should show that I sent an invite". Toggle is safer UX if they misclick.
    # But for a simple "Invite" button, usually it sets to True.
    # Let's check current status and flip it, or just set True?
    # I'll implement "Toggle" logic on the frontend if needed, here I'll just accept a query param or toggle?
    # Let's keep it simple: Make it a toggle.
    new_status = not guest.invite_sent
    return crud.mark_invite_sent(db, unique_code, new_status)

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

@app.post("/rsvp/claim/{unique_code}", response_model=schemas.Guest)
def claim_rsvp_code(unique_code: str, claim: schemas.DeviceClaim, db: Session = Depends(get_db)):
    # 1. First check if guest exists
    guest = crud.get_guest_by_code(db, unique_code=unique_code)
    if not guest:
        raise HTTPException(status_code=404, detail="Invalid invitation code")

    # 2. Try to claim (or get existing claim)
    updated_guest = crud.claim_guest_device(db, unique_code, claim.device_id)
    
    # 3. Validation: Is this the correct device?
    if updated_guest.device_id != claim.device_id:
        # Determine 403
        raise HTTPException(
            status_code=403, 
            detail="This invitation code has already been used on another device. Access is restricted to one device."
        )

    return updated_guest

@app.get("/guests/validate-device/{device_id}", response_model=schemas.Guest)
def validate_device_id(device_id: str, db: Session = Depends(get_db)):
    guest = crud.get_guest_by_device_id(db, device_id)
    if not guest:
        # It's not an error to not be found, but for REST semantics 404 makes sense for specific resource lookup.
        # However, for check-logic returning null or 404 is fine. Frontend handles 404 as "not logged in".
        raise HTTPException(status_code=404, detail="Device not linked to any guest")
    return guest

@app.delete("/guests/{unique_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guest(unique_code: str, db: Session = Depends(get_db), current_user: models.Admin = Depends(get_current_user)):
    success = crud.delete_guest(db, unique_code)
    if not success:
        raise HTTPException(status_code=404, detail="Guest not found")
    return None

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
