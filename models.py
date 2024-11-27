from sqlmodel import SQLModel, Field

class Lecture(SQLModel, table=True):
    id: int = Field(primary_key=True)
    slideName: str
    url: str

class Homework(SQLModel, table=True):
    id: int = Field(primary_key=True)
    hwName: str
    url: str

class Slack(SQLModel, table=True):
    id: int = Field(primary_key=True)
    slackName: str
    url: str
    slackChannel: str

class Attendance(SQLModel, table=True):
    id: int = Field(primary_key=True)
    studentName: str
    attendance: str
    date: str

class Mentors(SQLModel, table=True):
    id: int = Field(primary_key=True)
    mentorName: str
    mentorEmail: str
    mentorPhone: str
    mentorSlack: str