from sqlalchemy import Column, Integer, String, Boolean, Enum
from .database import Base
import enum
import string
import random

class RSVPStatus(str, enum.Enum):
    PENDING = "pending"
    ATTENDING = "attending"
    DECLINED = "declined"

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone_number = Column(String)
    unique_code = Column(String, unique=True, index=True)
    rsvp_status = Column(String, default=RSVPStatus.PENDING)
    
    # Enhanced Details
    email = Column(String, nullable=True)
    is_family = Column(Boolean, default=False)
    plus_one_count = Column(Integer, default=0)
    dietary_restrictions = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    device_id = Column(String, nullable=True)
    invite_sent = Column(Boolean, default=False) # Tracks the device that claimed this code

    @staticmethod
    def generate_unique_code():
        chars = string.ascii_uppercase + string.digits
        return ''.join(random.choice(chars) for _ in range(6))
