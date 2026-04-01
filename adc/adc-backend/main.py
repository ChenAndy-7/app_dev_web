from fastapi import FastAPI, Depends
from pydantic import BaseModel
import jwt
import datetime
import os
import sqlite3
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from contextlib import asynccontextmanager
from routers import lecture, slack, homework, attendance, mentors
from database import create_db_and_tables, db_path


def seed_database():
    """Create tables and seed initial data if empty (for Vercel's ephemeral filesystem)."""
    create_db_and_tables()
    con = sqlite3.connect(db_path)
    cur = con.cursor()

    # Only seed if tables are empty
    cur.execute("SELECT COUNT(*) FROM lecture")
    if cur.fetchone()[0] == 0:
        lectures = [
            (1, "Intro", "https://umd.zoom.us/rec/share/9hW7NpHQ4nNouT6DAj6vWsIf9ahn6oHv4IroPvjLq3R98wfPNyVMzgJqWQ4nEIG4.HTyCMn3NAWB-ETkj?startTime=1727824735000", "u98!&ye*", "https://docs.google.com/presentation/d/1VP9mrEZJZ9ALk2dBwadcGkWBg5twjUbM6VFZ7Fn3Vkk/edit?usp=sharing"),
            (2, "Git,HTML,CSS", "https://umd.zoom.us/rec/share/SfirrOZAemFf_xSm3zhZq7j_3G9vTJfKWoXr4YIJD7V3pxjMpQe_AIjGT-Wk3Tdv.R_nKA8KwWqv8umwS?startTime=1728428448000", "p6jk0se$", "https://docs.google.com/presentation/d/1wO047LhrT73QIcC5WzFhzGOtYhxap3aPq-nYbjmOSKk/edit?usp=sharing"),
            (3, "JavaScript", "https://umd.zoom.us/rec/share/Rl_BFUApl78S6omhJPRFLdM2bqNJOC5NWiJkWk9nDVe9G6wf54-EZCFnD8WbokIK.aHGXOgs6ZGmg7pad?startTime=1729033180000", "zP8i1D=B", "https://docs.google.com/presentation/d/1RWvO8TQ_ueJyBdSHfZ6oNvq9E6J3rYovItbX_Q-r-44/edit?usp=sharing"),
            (4, "TypeScript", "https://umd.zoom.us/rec/share/feRHep0QqN7yi6SJz8PwaQ6LrFP8BRJ96LSAf2lEhIxLeojaea27pPct65YuCS1-.sj_MOivR-ZpXWfqg?startTime=1729638243000", "A$NCN^j9", "https://docs.google.com/presentation/d/14ooPTPyM4QZPWMBq2sg4NypMQZAHQ4rY5n6CUn6l7zI/edit?usp=sharing"),
            (5, "React", "https://umd.zoom.us/rec/share/XEmxDC_2pexSnHkmHWfE2u828DWpQlhQNtxyV9gpkK1yCh0Hnj6M1A2Sdji7Z9DM.valW4Jz4qkEF0I0H?startTime=1730243323000", "$vv*7CV1", "https://docs.google.com/presentation/d/1YzEswdGs5zqZMaK8zPCaJl8PiiFFOYDnz2QVHLDAxak/edit?usp=sharing"),
            (6, "State in React", "https://umd.zoom.us/rec/share/1pUBQsed08aIyCtsS3NH3ZVDB23Uuco46RHwzb-M_qNZfkJgdgUOYx4krB2bQV2e.4QqU0j8o1gXApSNq?startTime=1730851409000", "t1tdsaB$", "https://docs.google.com/presentation/d/1GTiIFoT1EDLZ0Y9SC6G1f9c1-YZoMM-NMLOC8-0_-lI/edit?usp=sharing"),
        ]
        cur.executemany("INSERT INTO lecture VALUES (?, ?, ?, ?, ?)", lectures)

    cur.execute("SELECT COUNT(*) FROM homework")
    if cur.fetchone()[0] == 0:
        homeworks = [
            (1, "Personal Website", "Make a personal website using HTML and CSS", "2024-02-01", "https://forms.gle/MQejHVuzuVzj3uGE7"),
            (2, "Flexbox, Git: push and pull", "Complete levels and use flexbox in your personal website", "2024-02-08", "https://forms.gle/6XVNWAyVc5ADfZxz9"),
            (3, "Notecard App", "starter code in github, see slack for details", "2024-02-15", "https://forms.gle/fhbZwTntgESBEY6j8"),
            (4, "Memory Match Game", "starter code in github, see slack for details", "2024-02-22", "https://forms.gle/2bRc93qwD8nwJafu5"),
            (5, "React Reading", "learn about React concepts", "2024-02-29", "https://forms.gle/65u4Er1kCaEMJioa7"),
            (6, "Twitter Clone + Advanced React Reading", "make twitter clone, starter code in github, see slack for details. Learn about advanced React concepts", "2024-03-06", "https://forms.gle/8SXRVwGs4q2MQHJD6"),
        ]
        cur.executemany("INSERT INTO homework VALUES (?, ?, ?, ?, ?)", homeworks)

    con.commit()
    con.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_database()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://chenandy-7.github.io",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
# including the routers to different files
app.include_router(lecture.router, tags=["Lectures"])
app.include_router(slack.router, tags=["Slack"])
app.include_router(homework.router, tags=["Homeworks"])
app.include_router(attendance.router, tags=["Attendance"])
app.include_router(mentors.router, tags=["Mentors"])

# # Add CORS middleware to allow access from any origin
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow all origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allow all headers
# )


# Secret key for encoding and decoding JWT token (Keep this secret in production)
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"  # The algorithm for encoding the JWT

# Pydantic model for the request body
class UserRequest(BaseModel):
    email: str

# Function to generate JWT token
def create_jwt_token(email: str) -> str:
    # JWT expiration time (e.g., 15 minutes)
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    # Payload containing the user's email
    payload = {"email": email, "exp": expiration_time}
    
    # Generate the JWT token
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

# Endpoint to generate the JWT token
@app.post("/generate-jwt/")
async def generate_jwt(user: UserRequest) -> Dict[str, str]:
    # Extract email from the request
    email = user.email
    
    # Create JWT token using the provided email
    token = create_jwt_token(email)
    
    # Return the token in the response
    return {"access_token": token, "token_type": "bearer"}

# Run the server with: uvicorn filename:app --reload
# Note that backend functionality won't work unless "python main.py" is called first in the adc-backend folder


