from fastapi import APIRouter, Depends, HTTPException,  Query
from sqlmodel import Session, select
from database import get_session
from models import Lecture, LectureBase
from typing import Annotated
router = APIRouter()
SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/lecture")
async def get_lecture(
    session: SessionDep, 
    limit: Annotated[int|None, Query(gt=0, description="The number of results you would like to return")] = None
    ):
    if not limit:
        return session.exec(select(Lecture)).all()
    else:
        return session.exec(select(Lecture)).fetchmany(limit)

@router.post("/lecture/new", response_model=Lecture)
async def post_lecture(lecture: LectureBase, session: SessionDep):
    db_lecture = Lecture.model_validate(lecture)
    session.add(db_lecture)
    session.commit()
    session.refresh(db_lecture)
    return db_lecture

@router.delete("/lecture/{lecture_id}")
def delete_lecture(lecture_id: int, session: SessionDep):
     lecture = session.get(Lecture, lecture_id)
     if not lecture:
        raise HTTPException(status_code=404, detail="Hero not found")
     session.delete(lecture)
     session.commit()
     return {"ok": True}

@router.put("/lecture/{lecture_id}", response_model = Lecture)
async def update_message(lecture_id: int, updated_lecture: LectureBase, session: SessionDep):
    # Fetch the existing message from the database
    db_lecture = session.get(Lecture, lecture_id)
    if not db_lecture:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Update the message fields
    db_lecture.slideName = updated_lecture.slideName
    db_lecture.url = updated_lecture.url
    db_lecture.zoomLink = updated_lecture.zoomLink
    db_lecture.zoomPass = updated_lecture.zoomPass

    
    # Commit the changes to the database
    session.commit()
    session.refresh(db_lecture)
    
    return db_lecture