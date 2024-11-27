from sqlmodel import SQLModel, Field

class LectureBase(SQLModel):
    slideName: str
    url: str

class Lecture(LectureBase, table=True):
    id: int | None = Field(default=None, primary_key=True) 

class HomeworkBase(SQLModel):
    hwName: str
    url: str

class Homework(HomeworkBase, table=True):
    id: int | None = Field(default=None, primary_key=True) 

class SlackBase(SQLModel):
    slackName: str
    url: str
    slackChannel: str

class Slack(SlackBase, table=True):
    id: int | None = Field(default=None, primary_key=True) 

class AttendanceBase(SQLModel):
    studentName: str
    attendance: str
    date: str

class Attendance(AttendanceBase, table=True):
    id: int | None = Field(default=None, primary_key=True) 

class MentorsBase(SQLModel):
    mentorName: str
    mentorEmail: str
    mentorPhone: str
    mentorSlack: str

class Mentors(MentorsBase, table=True):
    id: int | None = Field(default=None, primary_key=True) 