import React, { useEffect, useState } from 'react';
import './attendance.css';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [dates, setDates] = useState<any[]>([]);
  const [newStudent, setNewStudent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });
  const [dailyStats, setDailyStats] = useState({ present: 0, absent: 0 });

  // Fetch data for attendance, students, and dates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceResponse = await fetch('http://localhost:8000/attendance');
        const attendanceData = await attendanceResponse.json();
        setAttendanceData(attendanceData);
        updateAttendanceStats(attendanceData);

        const studentsResponse = await fetch('http://localhost:8000/students');
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);

        fetchDates();  // Fetch dates when component mounts
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch dates from the server
  const fetchDates = () => {
    fetch('http://localhost:8000/dates')
      .then((response) => response.json())
      .then((data) => {
        setDates(data);
      })
      .catch((error) => console.error('Error fetching dates:', error));
  };

  // Update the attendance stats for the pie chart
  const updateAttendanceStats = (data: any[]) => {
    const presentCount = data.filter((record) => record.present).length;
    const absentCount = data.filter((record) => !record.present).length;
    setAttendanceStats({ present: presentCount, absent: absentCount });
  };

  const handleAddStudent = () => {
    if (!newStudent.trim()) return;

    // POST request to add a new student
    fetch('http://localhost:8000/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newStudent }),
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents((prev) => [...prev, data]); // Update the students list with the new student
        setNewStudent(''); // Clear the input field
      })
      .catch((error) => console.error('Error adding student:', error));
  };

  const handleAddDate = () => {
    if (!newDate.trim()) return;

    // POST request to add a new date
    fetch('http://localhost:8000/dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: newDate }),
    })
      .then(() => {
        setNewDate('');
        fetchDates(); // Fetch the updated dates after adding a new date
      })
      .catch((error) => console.error('Error adding date:', error));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const recordsForDate = attendanceData.filter(
      (record) => record.date_id === parseInt(date)
    );
    const presentCount = recordsForDate.filter((record) => record.present).length;
    const absentCount = recordsForDate.filter((record) => !record.present).length;
    setDailyStats({ present: presentCount, absent: absentCount });
  };

  const pieChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendanceStats.present, attendanceStats.absent],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#e57373'],
      },
    ],
  };

  const barChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: `Attendance for ${selectedDate}`,
        data: [dailyStats.present, dailyStats.absent],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  return (
    <div className="attendance-container">
      <h1>Attendance</h1>
      <div className="form-row">
        <div className="form-container">
          <label>Student Name:</label>
          <input
            type="text"
            value={newStudent}
            onChange={(e) => setNewStudent(e.target.value)}
            placeholder="Enter student name"
          />
          <button onClick={handleAddStudent}>Add Student</button>
        </div>

        <div className="form-container">
          <label>Date:</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <button onClick={handleAddDate}>Add Date</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              {dates.map((date) => (
                <th key={date.id}>{date.date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                {dates.map((date) => (
                  <td key={date.id}>
                    {attendanceData.some(
                      (record) =>
                        record.student_id === student.id &&
                        record.date_id === date.id &&
                        record.present
                    )
                      ? 'Present'
                      : 'Absent'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-wrapper">
        <div className="chart-container">
          <h3>Overall Attendance</h3>
          <Pie data={pieChartData} />
        </div>
        <div className="daily-chart-container">
          <h3>Daily Attendance</h3>
          <div className="daily-chart-content">
            <select
              onChange={(e) => handleDateSelect(e.target.value)}
              value={selectedDate}
            >
              <option value="">Select a Date</option>
              {dates.map((date) => (
                <option key={date.id} value={date.id}>
                  {date.date}
                </option>
              ))}
            </select>
            {selectedDate && <Bar data={barChartData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
