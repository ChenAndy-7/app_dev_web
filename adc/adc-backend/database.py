# This is the code for storing the data and using a database
import os
from sqlmodel import create_engine, Session, SQLModel

db_path = "/tmp/data.db" if os.environ.get("VERCEL") else "data.db"
sqlite_url = f"sqlite:///{db_path}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
# Creating the session, the session communicates with the database
def get_session():
    with Session(engine) as session:
        yield session