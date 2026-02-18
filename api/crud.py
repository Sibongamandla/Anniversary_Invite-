from sqlalchemy.orm import Session
try:
    from . import models, schemas, whatsapp
except ImportError:
    import models, schemas, whatsapp

from passlib.context import CryptContext



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_guest(db: Session, guest_id: int):
    return db.query(models.Guest).filter(models.Guest.id == guest_id).first()

def get_guest_by_code(db: Session, unique_code: str):
    # Robust lookup: Remove whitespace and ensure uppercase
    if unique_code:
        unique_code = unique_code.strip().upper()
    return db.query(models.Guest).filter(models.Guest.unique_code == unique_code).first()

def get_guest_by_device_id(db: Session, device_id: str):
    from sqlalchemy import or_
    return db.query(models.Guest).filter(or_(models.Guest.device_id == device_id, models.Guest.device_id_2 == device_id)).first()

def get_guests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Guest).offset(skip).limit(limit).all()

def create_guest(db: Session, guest: schemas.GuestCreate):
    # Generates a unique code ensures it's unique
    while True:
        code = models.Guest.generate_unique_code()
        if not get_guest_by_code(db, code):
            break
            
    db_guest = models.Guest(
        name=guest.name, 
        phone_number=guest.phone_number,
        unique_code=code
    )
    db.add(db_guest)
    db.commit()
    db.refresh(db_guest)
    return db_guest

def update_guest_rsvp(db: Session, unique_code: str, rsvp_status: str, notes: str = None, 
                      email: str = None, is_family: bool = False, plus_one_count: int = 0, dietary_restrictions: str = None, **kwargs):
    db_guest = get_guest_by_code(db, unique_code)
    if db_guest:
        db_guest.rsvp_status = rsvp_status
        if notes is not None:
             db_guest.notes = notes
        if email is not None:
            db_guest.email = email
        if is_family is not None:
            db_guest.is_family = is_family
        if plus_one_count is not None:
            db_guest.plus_one_count = plus_one_count
        if dietary_restrictions is not None:
            db_guest.dietary_restrictions = dietary_restrictions
        
        # New Fields
        if kwargs.get('starter_choice') is not None:
            db_guest.starter_choice = kwargs.get('starter_choice')
        if kwargs.get('main_choice') is not None:
            db_guest.main_choice = kwargs.get('main_choice')
        if kwargs.get('song_request') is not None:
            db_guest.song_request = kwargs.get('song_request')
        if kwargs.get('shuttle_airport') is not None:
            db_guest.shuttle_airport = kwargs.get('shuttle_airport')
        if kwargs.get('shuttle_venue') is not None:
            db_guest.shuttle_venue = kwargs.get('shuttle_venue')
        if kwargs.get('accommodation_needed') is not None:
            db_guest.accommodation_needed = kwargs.get('accommodation_needed')
        if kwargs.get('sunset_surprise_attendance') is not None:
            db_guest.sunset_surprise_attendance = kwargs.get('sunset_surprise_attendance')
        if kwargs.get('preferred_names') is not None:
            db_guest.preferred_names = kwargs.get('preferred_names')

        db.commit()
        db.refresh(db_guest)
        db.refresh(db_guest)
    return db_guest

def delete_guest(db: Session, unique_code: str):
    db_guest = get_guest_by_code(db, unique_code)
    if db_guest:
        db.delete(db_guest)
        db.commit()
        return True
    return False

def mark_invite_sent(db: Session, unique_code: str, sent: bool = True):
    db_guest = get_guest_by_code(db, unique_code)
    if db_guest:
        db_guest.invite_sent = sent
        db.commit()
        db.refresh(db_guest)
    return db_guest

def create_admin(db: Session, admin: schemas.AdminCreate):
    hashed_password = get_password_hash(admin.password)
    db_admin = models.Admin(username=admin.username, hashed_password=hashed_password)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def claim_guest_device(db: Session, unique_code: str, device_id: str):
    db_guest = get_guest_by_code(db, unique_code)
    if db_guest:
        # Check matching
        if db_guest.device_id == device_id or db_guest.device_id_2 == device_id:
            return db_guest
        
        # If no device is claimed, claim slot 1
        if not db_guest.device_id:
            db_guest.device_id = device_id
            db.commit()
            db.refresh(db_guest)
        
        # If slot 1 is taken (by someone else), try slot 2
        elif not db_guest.device_id_2:
            db_guest.device_id_2 = device_id
            db.commit()
            db.refresh(db_guest)

    return db_guest

def get_admin_by_username(db: Session, username: str):
    return db.query(models.Admin).filter(models.Admin.username == username).first()

def broadcast_message(db: Session, message: str, filter_status: str = "all"):
    query = db.query(models.Guest)
    
    if filter_status and filter_status.lower() != "all":
        # Check against valid RSVP statuses if needed, or just exact match
        query = query.filter(models.Guest.rsvp_status == filter_status.lower())
        
    guests = query.all()
    count = 0
    print(f"\n--- [WHATSAPP BROADCAST START] ---")
    print(f"Filter: {filter_status}")
    print(f"Message: {message}\n")
    
    for guest in guests:
        if guest.phone_number:
            # Simulate logging
            print(f"To: {guest.name} ({guest.phone_number})...")
            # Actual Send
            success = whatsapp.send_text_message(guest.phone_number, message)
            if success:
                count += 1
        else:
            print(f"Skipping {guest.name} (No phone number)")
        
    print(f"\n--- [WHATSAPP BROADCAST END] ---\n")
    return count
