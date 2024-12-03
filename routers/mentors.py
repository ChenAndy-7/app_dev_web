from fastapi import APIRouter, Depends, HTTPException,  Query
from sqlmodel import Session, select
from database import get_session
from models import GroupsBase, Groups
from typing import Annotated

router = APIRouter()
SessionDep = Annotated[Session, Depends(get_session)]

# here is where you do the fastapi stuff:
# API to add group
# @router.post("/add-group/")
# async def add_group(group: GroupsBase, session: SessionDep):
#     db_groups = Groups.model_validate(Groups)
#     session.add(db_groups)
#     session.commit()
#     session.refresh(db_groups)
#     return db_groups
@router.get("/groups")
async def get_groups(session: SessionDep):
    # Query all groups from the database
    groups = session.exec(select(Groups)).all()
    
    # Format response to split students into a list
    return [
        {
            "mentor1": group.mentor1,
            "mentor2": group.mentor2,
            "students": group.students.split(",") if group.students else []  # Convert string to list
        }
        for group in groups
    ]


@router.post("/groups/new", response_model=Groups)
async def add_group(group: GroupsBase, session: SessionDep):
    db_group = Groups.from_orm(group)
    session.add(db_group)
    session.commit()
    session.refresh(db_group)
    return db_group

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