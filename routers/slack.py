from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from models import Slack, SlackBase
from typing import Annotated
from database import get_session
router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/slack")
async def get_tweets(
    session: SessionDep, 
    limit: Annotated[int|None, Query(gt=0, description="The number of results you would like to return")] = None
    ):
    if not limit:
        return session.exec(select(Slack)).all()
    else:
        return session.exec(select(Slack)).fetchmany(limit)

@router.post("/slack/new", response_model=Slack)
async def post_tweets(tweet: SlackBase, session: SessionDep):
    db_message = Slack.model_validate(tweet)
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message

@router.delete("/slack/{message_id}")
def delete_tweet(message_id: int, session: SessionDep):
    tweet = session.get(Slack, message_id)
    if not tweet:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(tweet)
    session.commit()
    return {"ok": True}