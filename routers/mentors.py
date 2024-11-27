from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List
from database import get_session
from models import Mentors, MentorsBase

router = APIRouter()

# here is where you do the fastapi stuff:

# @router.get("/tweets")
# async def get_tweets(session: SessionDep):
#     return session.exec(select(Tweet)).all()

# @router.post("/tweets/new", response_model=Tweet)
# async def post_tweets(tweet: TweetBase, session: SessionDep):
#     db_tweet = Tweet.model_validate(tweet)
#     session.add(db_tweet)
#     session.commit()
#     session.refresh(db_tweet)
#     return db_tweet

# @router.delete("/tweets/{tweet_id}")
# def delete_tweet(tweet_id: int, session: SessionDep):
#     tweet = session.get(Tweet, tweet_id)
#     if not tweet:
#         raise HTTPException(status_code=404, detail="Hero not found")
#     session.delete(tweet)
#     session.commit()
#     return {"ok": True}