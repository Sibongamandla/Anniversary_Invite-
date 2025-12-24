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

    class Config:
        from_attributes = True

class GuestRSVPUpdate(BaseModel):
    rsvp_status: RSVPStatus
    notes: Optional[str] = None
    email: Optional[str] = None
    is_family: bool = False
    plus_one_count: int = 0
    dietary_restrictions: Optional[str] = None

class AdminBase(BaseModel):
    username: str

class AdminCreate(AdminBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
