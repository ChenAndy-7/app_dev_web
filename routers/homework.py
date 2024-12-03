from fastapi import APIRouter, HTTPException
import sqlite3
from typing import List
from pydantic import BaseModel

router = APIRouter()

# Pydantic model for homework
class HomeworkBase(BaseModel):
    hwName: str
    description: str
    dueDate: str
    url: str

class Homework(HomeworkBase):
    id: int

def get_db():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn

@router.get("/homework", response_model=List[Homework])
async def get_homework():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM homework")
    homeworks = cur.fetchall()
    conn.close()
    return [dict(hw) for hw in homeworks]

@router.post("/homework", response_model=Homework)
async def create_homework(new_homework: HomeworkBase):
    conn = get_db()
    cur = conn.cursor()
    
    # Insert new homework
    cur.execute(
        """
        INSERT INTO homework (hwName, description, dueDate, url)
        VALUES (?, ?, ?, ?)
        """,
        (new_homework.hwName, new_homework.description, new_homework.dueDate, new_homework.url)
    )
    
    # Get the id of the newly inserted homework
    homework_id = cur.lastrowid
    
    conn.commit()
    conn.close()
    
    # Return the complete homework object
    return {
        "id": homework_id,
        **new_homework.dict()
    }

@router.put("/homework/{homework_id}", response_model=Homework)
async def update_homework(homework_id: int, updated_homework: HomeworkBase):
    conn = get_db()
    cur = conn.cursor()
    
    # Check if homework exists
    cur.execute("SELECT * FROM homework WHERE id = ?", (homework_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Homework not found")
    
    # Update the homework
    cur.execute(
        """
        UPDATE homework 
        SET hwName = ?, description = ?, dueDate = ?, url = ?
        WHERE id = ?
        """,
        (updated_homework.hwName, updated_homework.description, 
         updated_homework.dueDate, updated_homework.url, homework_id)
    )
    
    conn.commit()
    
    # Fetch the updated homework
    cur.execute("SELECT * FROM homework WHERE id = ?", (homework_id,))
    updated = dict(cur.fetchone())
    
    conn.close()
    return updated

@router.delete("/homework/{homework_id}")
async def delete_homework(homework_id: int):
    conn = get_db()
    cur = conn.cursor()
    
    # Check if homework exists
    cur.execute("SELECT * FROM homework WHERE id = ?", (homework_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Homework not found")
    
    # Delete the homework
    cur.execute("DELETE FROM homework WHERE id = ?", (homework_id,))
    conn.commit()
    conn.close()
    
    return {"ok": True}
