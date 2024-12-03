# This is the code for storing the data and using a database
from sqlmodel import create_engine, Session, SQLModel

sqlite_database_name = "data.db"
sqlite_url = f"sqlite:///{sqlite_database_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
# Creating the session, the session communicates with the database
def get_session():
    with Session(engine) as session:
        yield session