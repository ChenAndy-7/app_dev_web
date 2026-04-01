from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from models import Slack, SlackBase
from typing import Annotated
from database import get_session
router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/slack")
async def get_messages(
    session: SessionDep, 
    limit: Annotated[int|None, Query(gt=0, description="The number of results you would like to return")] = None
    ):
    if not limit:
        return session.exec(select(Slack)).all()
    else:
        return session.exec(select(Slack)).fetchmany(limit)

@router.post("/slack/new", response_model=Slack)
async def post_message(message: SlackBase, session: SessionDep):
    db_message = Slack.model_validate(message)
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message

@router.put("/slack/{message_id}", response_model=Slack)
async def update_message(message_id: int, updated_message: SlackBase, session: SessionDep):
    # Fetch the existing message from the database
    db_message = session.get(Slack, message_id)
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Update the message fields
    db_message.content = updated_message.content
    db_message.type = updated_message.type
    db_message.isImportant = updated_message.isImportant
    db_message.forLater = updated_message.forLater
    db_message.timestamp = updated_message.timestamp
    
    # Commit the changes to the database
    session.commit()
    session.refresh(db_message)
    
    return db_message

@router.delete("/slack/{message_id}")
def delete_message(message_id: int, session: SessionDep):
    tweet = session.get(Slack, message_id)
    if not tweet:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(tweet)
    session.commit()
    return {"ok": True}