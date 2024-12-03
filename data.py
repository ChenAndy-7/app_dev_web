import sqlite3

# Connect to the SQLite database
con = sqlite3.connect('data.db')

# Create a cursor object using the connection
cur = con.cursor()

lecture = [
    (1, "Intro", "https://umd.zoom.us/rec/share/9hW7NpHQ4nNouT6DAj6vWsIf9ahn6oHv4IroPvjLq3R98wfPNyVMzgJqWQ4nEIG4.HTyCMn3NAWB-ETkj?startTime=1727824735000", "u98!&ye*", "https://docs.google.com/presentation/d/1VP9mrEZJZ9ALk2dBwadcGkWBg5twjUbM6VFZ7Fn3Vkk/edit?usp=sharing"),
    (2, "Git,HTML,CSS", "https://umd.zoom.us/rec/share/SfirrOZAemFf_xSm3zhZq7j_3G9vTJfKWoXr4YIJD7V3pxjMpQe_AIjGT-Wk3Tdv.R_nKA8KwWqv8umwS?startTime=1728428448000", "p6jk0se$", "https://docs.google.com/presentation/d/1wO047LhrT73QIcC5WzFhzGOtYhxap3aPq-nYbjmOSKk/edit?usp=sharing"),
    (3, "JavaScript","https://umd.zoom.us/rec/share/Rl_BFUApl78S6omhJPRFLdM2bqNJOC5NWiJkWk9nDVe9G6wf54-EZCFnD8WbokIK.aHGXOgs6ZGmg7pad?startTime=1729033180000", "zP8i1D=B", "https://docs.google.com/presentation/d/1RWvO8TQ_ueJyBdSHfZ6oNvq9E6J3rYovItbX_Q-r-44/edit?usp=sharing"),
    (4, "TypeScript","https://umd.zoom.us/rec/share/feRHep0QqN7yi6SJz8PwaQ6LrFP8BRJ96LSAf2lEhIxLeojaea27pPct65YuCS1-.sj_MOivR-ZpXWfqg?startTime=1729638243000", "A$NCN^j9", "https://docs.google.com/presentation/d/14ooPTPyM4QZPWMBq2sg4NypMQZAHQ4rY5n6CUn6l7zI/edit?usp=sharing"),
    (5, "React", "https://umd.zoom.us/rec/share/XEmxDC_2pexSnHkmHWfE2u828DWpQlhQNtxyV9gpkK1yCh0Hnj6M1A2Sdji7Z9DM.valW4Jz4qkEF0I0H?startTime=1730243323000", "$vv*7CV1", "https://docs.google.com/presentation/d/1YzEswdGs5zqZMaK8zPCaJl8PiiFFOYDnz2QVHLDAxak/edit?usp=sharing"),
    (6, "State in React","https://umd.zoom.us/rec/share/1pUBQsed08aIyCtsS3NH3ZVDB23Uuco46RHwzb-M_qNZfkJgdgUOYx4krB2bQV2e.4QqU0j8o1gXApSNq?startTime=1730851409000", "t1tdsaB$", "https://docs.google.com/presentation/d/1GTiIFoT1EDLZ0Y9SC6G1f9c1-YZoMM-NMLOC8-0_-lI/edit?usp=sharing")
]

homework = [
    (1, "Personal Website", "Make a personal website using HTML and CSS", "2024-02-01", "https://forms.gle/MQejHVuzuVzj3uGE7"),
    (2, "Flexbox, Git: push and pull", "Complete levels and use flexbox in your personal website", "2024-02-08", "https://forms.gle/6XVNWAyVc5ADfZxz9"),
    (3, "Notecard App", "starter code in github, see slack for details", "2024-02-15", "https://forms.gle/fhbZwTntgESBEY6j8"),
    (4, "Memory Match Game", "starter code in github, see slack for details", "2024-02-22", "https://forms.gle/2bRc93qwD8nwJafu5"),
    (5, "React Reading", "learn about React concepts", "2024-02-29", "https://forms.gle/65u4Er1kCaEMJioa7"),
    (6, "Twitter Clone + Advanced React Reading", "make twitter clone, starter code in github, see slack for details. Learn about advanced React concepts", "2024-03-06", "https://forms.gle/8SXRVwGs4q2MQHJD6")
]

slack = []
attendance = []
mentors = []

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
    description TEXT NOT NULL,
    dueDate TEXT NOT NULL,
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
cur.executemany("INSERT INTO homework VALUES (?, ?, ?, ?, ?)", homework)
cur.executemany("INSERT INTO slack VALUES (?, ?, ?, ?, ?, ?, ?)", slack)
cur.executemany("INSERT INTO attendance VALUES (?, ?, ?, ?)", attendance)
cur.executemany("INSERT INTO mentors VALUES (?, ?, ?, ?, ?)", mentors)

con.commit()
print("Database initialized with initial data")

con.close()

