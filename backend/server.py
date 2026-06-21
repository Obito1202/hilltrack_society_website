from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import shutil
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Request
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict


# ---------- Setup ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

UPLOAD_DIR = Path(os.environ.get('UPLOAD_DIR', str(ROOT_DIR / 'uploads')))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = 'HS256'

app = FastAPI(title="Hilltrack NGO API")
api_router = APIRouter(prefix="/api")

# Serve uploads via /api/uploads/<filename>
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# ---------- Auth Helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"username": user["username"], "role": user.get("role", "admin")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Models ----------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class LoginIn(BaseModel):
    username: str
    password: str


class LoginOut(BaseModel):
    token: str
    username: str


class Member(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    email: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    order: int = 0
    created_at: str = Field(default_factory=now_iso)


class MemberIn(BaseModel):
    name: str
    role: str
    email: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    order: int = 0


class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    date: str  # ISO date string
    location: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    created_at: str = Field(default_factory=now_iso)


class EventIn(BaseModel):
    title: str
    date: str
    location: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = ""


class Achievement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    year: str
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    created_at: str = Field(default_factory=now_iso)


class AchievementIn(BaseModel):
    title: str
    year: str
    description: Optional[str] = ""
    image_url: Optional[str] = ""


class School(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    visit_date: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    created_at: str = Field(default_factory=now_iso)


class SchoolIn(BaseModel):
    name: str
    location: str
    visit_date: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = ""


class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    caption: Optional[str] = ""
    image_url: str
    created_at: str = Field(default_factory=now_iso)


class GalleryItemIn(BaseModel):
    caption: Optional[str] = ""
    image_url: str


class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    about: str = ""
    aims: List[str] = Field(default_factory=list)
    contact_phone: str = ""
    contact_email: str = ""
    contact_address: str = ""
    bank_details: str = ""
    upi_id: str = ""


# ---------- Auth Routes ----------
@api_router.post("/auth/login", response_model=LoginOut)
async def login(body: LoginIn):
    user = await db.users.find_one({"username": body.username.lower()})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user["username"])
    return LoginOut(token=token, username=user["username"])


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


# ---------- Generic CRUD helper ----------
def _strip_id(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


# ---------- Members ----------
@api_router.get("/members", response_model=List[Member])
async def list_members():
    docs = await db.members.find({}, {"_id": 0}).sort("order", 1).to_list(500)
    return docs


@api_router.post("/members", response_model=Member)
async def create_member(body: MemberIn, admin=Depends(get_current_admin)):
    obj = Member(**body.model_dump())
    await db.members.insert_one(obj.model_dump())
    return obj


@api_router.put("/members/{member_id}", response_model=Member)
async def update_member(member_id: str, body: MemberIn, admin=Depends(get_current_admin)):
    res = await db.members.update_one({"id": member_id}, {"$set": body.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.members.find_one({"id": member_id}, {"_id": 0})
    return doc


@api_router.delete("/members/{member_id}")
async def delete_member(member_id: str, admin=Depends(get_current_admin)):
    res = await db.members.delete_one({"id": member_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ---------- Events ----------
@api_router.get("/events", response_model=List[Event])
async def list_events():
    docs = await db.events.find({}, {"_id": 0}).sort("date", -1).to_list(500)
    return docs


@api_router.post("/events", response_model=Event)
async def create_event(body: EventIn, admin=Depends(get_current_admin)):
    obj = Event(**body.model_dump())
    await db.events.insert_one(obj.model_dump())
    return obj


@api_router.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, body: EventIn, admin=Depends(get_current_admin)):
    res = await db.events.update_one({"id": event_id}, {"$set": body.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.events.find_one({"id": event_id}, {"_id": 0})
    return doc


@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, admin=Depends(get_current_admin)):
    res = await db.events.delete_one({"id": event_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ---------- Achievements ----------
@api_router.get("/achievements", response_model=List[Achievement])
async def list_achievements():
    docs = await db.achievements.find({}, {"_id": 0}).sort("year", -1).to_list(500)
    return docs


@api_router.post("/achievements", response_model=Achievement)
async def create_achievement(body: AchievementIn, admin=Depends(get_current_admin)):
    obj = Achievement(**body.model_dump())
    await db.achievements.insert_one(obj.model_dump())
    return obj


@api_router.put("/achievements/{a_id}", response_model=Achievement)
async def update_achievement(a_id: str, body: AchievementIn, admin=Depends(get_current_admin)):
    res = await db.achievements.update_one({"id": a_id}, {"$set": body.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.achievements.find_one({"id": a_id}, {"_id": 0})
    return doc


@api_router.delete("/achievements/{a_id}")
async def delete_achievement(a_id: str, admin=Depends(get_current_admin)):
    res = await db.achievements.delete_one({"id": a_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ---------- Schools ----------
@api_router.get("/schools", response_model=List[School])
async def list_schools():
    docs = await db.schools.find({}, {"_id": 0}).sort("visit_date", -1).to_list(500)
    return docs


@api_router.post("/schools", response_model=School)
async def create_school(body: SchoolIn, admin=Depends(get_current_admin)):
    obj = School(**body.model_dump())
    await db.schools.insert_one(obj.model_dump())
    return obj


@api_router.put("/schools/{s_id}", response_model=School)
async def update_school(s_id: str, body: SchoolIn, admin=Depends(get_current_admin)):
    res = await db.schools.update_one({"id": s_id}, {"$set": body.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.schools.find_one({"id": s_id}, {"_id": 0})
    return doc


@api_router.delete("/schools/{s_id}")
async def delete_school(s_id: str, admin=Depends(get_current_admin)):
    res = await db.schools.delete_one({"id": s_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ---------- Gallery ----------
@api_router.get("/gallery", response_model=List[GalleryItem])
async def list_gallery():
    docs = await db.gallery.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/gallery", response_model=GalleryItem)
async def create_gallery(body: GalleryItemIn, admin=Depends(get_current_admin)):
    obj = GalleryItem(**body.model_dump())
    await db.gallery.insert_one(obj.model_dump())
    return obj


@api_router.delete("/gallery/{g_id}")
async def delete_gallery(g_id: str, admin=Depends(get_current_admin)):
    res = await db.gallery.delete_one({"id": g_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ---------- Settings (About / Aims / Contact / Donate) ----------
DEFAULT_AIMS = [
    "Provide educational assistance, books, notebooks, stationery, and study materials to students.",
    "Organize educational, motivational, and personality development programs.",
    "Provide scholarships to deserving and economically weaker students.",
    "Organize career counseling, competitive examination guidance, and skill development programs.",
    "Establish libraries, reading rooms, and study centers.",
    "Conduct programs on environmental protection, health awareness, and social welfare.",
    "Promote sports, cultural, and educational activities.",
    "Run assistance programs for students from economically weaker sections.",
    "Promote environmental awareness and sustainable practices in schools, communities, and rural areas.",
    "Promote and facilitate solar-powered street lighting systems in villages.",
    "Research and develop sustainable and renewable sources of energy.",
    "Conduct research on biofuel and biogas as alternatives to LPG.",
    "Support projects converting agricultural residue and bio-waste into bioenergy.",
]


@api_router.get("/settings", response_model=Settings)
async def get_settings():
    doc = await db.settings.find_one({"_id": "main"})
    if not doc:
        return Settings(
            about="Hilltrack Society for Education, Environment and Energy is a registered NGO headquartered in Nainital, Uttarakhand. We work at the intersection of rural education, environmental sustainability, and renewable energy — empowering communities across the Himalayan foothills.",
            aims=DEFAULT_AIMS,
            contact_phone="",
            contact_email="vaibhavjoshi1202@gmail.com",
            contact_address="Joshi Niwas, Malla Krishnapur, Tallital, Nainital, Uttarakhand",
            bank_details="",
            upi_id="",
        )
    doc.pop("_id", None)
    return Settings(**doc)


@api_router.put("/settings", response_model=Settings)
async def update_settings(body: Settings, admin=Depends(get_current_admin)):
    data = body.model_dump()
    await db.settings.update_one({"_id": "main"}, {"$set": data}, upsert=True)
    return body


# ---------- Upload ----------
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), admin=Depends(get_current_admin)):
    suffix = Path(file.filename or "").suffix.lower() or ".bin"
    if suffix not in {".jpg", ".jpeg", ".png", ".gif", ".webp"}:
        raise HTTPException(status_code=400, detail="Only image files allowed")
    filename = f"{uuid.uuid4().hex}{suffix}"
    dest = UPLOAD_DIR / filename
    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)
    return {"url": f"/api/uploads/{filename}"}


# ---------- Health ----------
@api_router.get("/")
async def root():
    return {"message": "Hilltrack NGO API", "ok": True}


# ---------- Seed & startup ----------
async def seed_admin_and_data():
    admin_username = os.environ.get("ADMIN_USERNAME", "admin").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"username": admin_username})
    if existing is None:
        await db.users.insert_one({
            "username": admin_username,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": now_iso(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"username": admin_username},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )

    # Seed initial governing body if empty
    count = await db.members.count_documents({})
    if count == 0:
        seed_members = [
            {"name": "Lt. Col. Roshan Lal", "role": "President", "email": "roxy.kohli74@gmail.com", "order": 1},
            {"name": "Shri R. C. Kandpal", "role": "Vice President", "email": "rameshkandpal1963@gmail.com", "description": "Retd. Deputy Registrar, High Court Uttarakhand", "order": 2},
            {"name": "Vaibhav Joshi", "role": "Secretary", "email": "vaibhavjoshi1202@gmail.com", "description": "Software Engineer, Deutsche Bank", "order": 3},
            {"name": "Kumari Adwika", "role": "Joint Secretary", "email": "adwika553@gmail.com", "description": "Student", "order": 4},
            {"name": "Kushagra Joshi", "role": "Treasurer", "email": "k.joshi@iitg.ac.in", "description": "B.Tech 3rd Year, IIT Guwahati", "order": 5},
            {"name": "Alok Chandra Joshi", "role": "Executive Member", "email": "alokjoshi17@gmail.com", "description": "Principal, GBUPS Mallital", "order": 6},
            {"name": "Dr. Suman Karanpal Rawat", "role": "Executive Member", "email": "jsuman26@gmail.com", "description": "Associate Professor, Amity University", "order": 7},
            {"name": "Ravin Rawat", "role": "Executive Member", "email": "ravinrawat26@gmail.com", "description": "Student", "order": 8},
            {"name": "Lokesh Kumar", "role": "Executive Member", "email": "lalitlokesh87@gmail.com", "description": "Agency Manager, SBI Life, Nainital", "order": 9},
        ]
        for m in seed_members:
            obj = Member(**m)
            await db.members.insert_one(obj.model_dump())


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("username", unique=True)
    await seed_admin_and_data()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
