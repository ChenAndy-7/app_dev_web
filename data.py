import sqlite3

# connect to the SQLite database
con = sqlite3.connect('data.db')

# create a cursor object using the connection
cur = con.cursor()

lecture = [
    (1, "Intro", "test", "test", "https://docs.google.com/presentation/d/1VP9mrEZJZ9ALk2dBwadcGkWBg5twjUbM6VFZ7Fn3Vkk/edit?usp=sharing"),
    (2, "Git,HTML,CSS", "test", "test", "https://docs.google.com/presentation/d/1wO047LhrT73QIcC5WzFhzGOtYhxap3aPq-nYbjmOSKk/edit?usp=sharing"),
    (3, "JavaScript","test", "test", "https://docs.google.com/presentation/d/1RWvO8TQ_ueJyBdSHfZ6oNvq9E6J3rYovItbX_Q-r-44/edit?usp=sharing"),
    (4, "TypeScript","test", "test", "https://docs.google.com/presentation/d/14ooPTPyM4QZPWMBq2sg4NypMQZAHQ4rY5n6CUn6l7zI/edit?usp=sharing"),
    (5, "React", "test", "test", "https://docs.google.com/presentation/d/1YzEswdGs5zqZMaK8zPCaJl8PiiFFOYDnz2QVHLDAxak/edit?usp=sharing"),
    (6, "State in React","test", "test", "https://docs.google.com/presentation/d/1GTiIFoT1EDLZ0Y9SC6G1f9c1-YZoMM-NMLOC8-0_-lI/edit?usp=sharing")
]

homework = [
    (1, "HW1", "https://forms.gle/MQejHVuzuVzj3uGE7"),
    (2, "HW2", "https://forms.gle/6XVNWAyVc5ADfZxz9"),
    (3, "HW3", "https://forms.gle/fhbZwTntgESBEY6j8"),
    (4, "HW4", "https://forms.gle/2bRc93qwD8nwJafu5"),
    (5, "Hw5", "https://forms.gle/65u4Er1kCaEMJioa7")
]

slack = [ ]

attendance =  [ ]

mentors = [ ]

# Define SQL for creating tables
create_lecture_table = """
CREATE TABLE IF NOT EXISTS lecture (
    id INTEGER PRIMARY KEY,
    slideName TEXT NOT NULL,
    zoomLink TEXT NOT NULL,
    zoomPass TEXT NOT NULL,
    url TEXT NOT NULL
);
"""

create_homework_table = """
CREATE TABLE IF NOT EXISTS homework (
    id INTEGER PRIMARY KEY,
    hwName TEXT NOT NULL,
    url TEXT NOT NULL
);
"""

create_slack_table = """
CREATE TABLE IF NOT EXISTS slack (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    isImportant INTEGER NOT NULL,
    forLater INTEGER NOT NULL,
    timestamp TEXT NOT NULL
);
"""

create_attendance_table = """
CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY,
    studentName TEXT NOT NULL,
    attendance TEXT NOT NULL,
    date TEXT NOT NULL
);
"""

create_mentors_table = """
CREATE TABLE IF NOT EXISTS mentors (
    id INTEGER PRIMARY KEY,
    mentorName TEXT NOT NULL,
    mentorEmail TEXT NOT NULL,
    mentorPhone TEXT NOT NULL,
    mentorSlack TEXT NOT NULL
);
"""

# Execute table creation
cur.execute(create_lecture_table)
cur.execute(create_homework_table)
cur.execute(create_slack_table)
cur.execute(create_attendance_table)
cur.execute(create_mentors_table)

cur.executemany("INSERT INTO lecture VALUES (?, ?, ?, ?, ?)", lecture)
cur.executemany("INSERT INTO homework VALUES (?, ?, ?)", homework)
cur.executemany("INSERT INTO slack VALUES (?, ?, ?, ?, ?, ?, ?)", slack)
cur.executemany("INSERT INTO attendance VALUES (?, ?, ?, ?)", attendance)
cur.executemany("INSERT INTO mentors VALUES (?, ?, ?, ?, ?)", mentors)

con.commit()