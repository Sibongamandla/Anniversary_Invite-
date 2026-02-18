from pydantic import BaseModel
from typing import Optional
from enum import Enum

class RSVPStatus(str, Enum):
    PENDING = "pending"
    ATTENDING = "attending"
    DECLINED = "declined"

class GuestBase(BaseModel):
    name: str
    phone_number: str

class GuestCreate(GuestBase):
    pass

class Guest(GuestBase):
    id: int
    unique_code: str
    rsvp_status: RSVPStatus
    notes: Optional[str] = None
    email: Optional[str] = None
    is_family: bool = False
    plus_one_count: int = 0
    dietary_restrictions: Optional[str] = None
    device_id: Optional[str] = None
    device_id_2: Optional[str] = None
    invite_sent: bool = False
    starter_choice: Optional[str] = None
    main_choice: Optional[str] = None
    song_request: Optional[str] = None
    shuttle_airport: bool = False
    shuttle_venue: bool = False
    accommodation_needed: bool = False
    sunset_surprise_attendance: bool = False
    preferred_names: Optional[str] = None

    class Config:
        from_attributes = True

class GuestRSVPUpdate(BaseModel):
    rsvp_status: RSVPStatus
    notes: Optional[str] = None
    email: Optional[str] = None
    is_family: bool = False
    plus_one_count: int = 0
    dietary_restrictions: Optional[str] = None
    device_id: Optional[str] = None
    starter_choice: Optional[str] = None
    main_choice: Optional[str] = None
    song_request: Optional[str] = None
    shuttle_airport: bool = False
    shuttle_venue: bool = False
    accommodation_needed: bool = False
    sunset_surprise_attendance: bool = False
    preferred_names: Optional[str] = None

class AdminBase(BaseModel):
    username: str

class AdminCreate(AdminBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class DeviceClaim(BaseModel):
    device_id: str

class BroadcastRequest(BaseModel):
    message: str
    filter_status: Optional[str] = "all"  # Options: "all", "attending", "pending"
