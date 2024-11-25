from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import jwt
import datetime
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# Add CORS middleware to allow access from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


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
