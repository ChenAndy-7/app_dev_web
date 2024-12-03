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
  const [newStudent, setNewStudent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dailyStats, setDailyStats] = useState({ present: 0, absent: 0 });

  // Fetch attendance records
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = () => {
    fetch('http://localhost:5175/api/attendance')
      .then((response) => response.json())
      .then((data) => {
        setAttendanceData(data);
        updateAttendanceStats(data);
        generateDates(data);
      })
      .catch((error) => console.error('Error fetching attendance data:', error));
  };

  const updateAttendanceStats = (data: any[]) => {
    const presentCount = data.filter((record) => record.present).length;
    const absentCount = data.filter((record) => !record.present).length;
    setAttendanceStats({ present: presentCount, absent: absentCount });
  };

  const updateDailyStats = (date: string) => {
    const recordsForDate = attendanceData.filter(
      (record) =>
        new Date(record.attendance_date).toLocaleDateString('en-US') === date
    );
    const presentCount = recordsForDate.filter((record) => record.present).length;
    const absentCount = recordsForDate.filter((record) => !record.present).length;
    setDailyStats({ present: presentCount, absent: absentCount });
  };

  const generateDates = (data: any[]) => {
    const dateSet = new Set<string>();
    data.forEach((record) => {
      const formattedDate = new Date(record.attendance_date).toLocaleDateString('en-US');
      dateSet.add(formattedDate);
    });
    setDates([...dateSet].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()));
  };

  const handleAddStudent = () => {
    if (!newStudent.trim()) return;

    fetch('http://localhost:5175/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_name: newStudent }),
    })
      .then((response) => response.json())
      .then(() => {
        setNewStudent('');
        fetchAttendanceData();
      })
      .catch((error) => console.error('Error adding student:', error));
  };

  const handleAddDate = () => {
    if (!newDate.trim()) return;

    console.log(`Adding new date: ${newDate}`);
    setNewDate('');
    fetchAttendanceData();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    updateDailyStats(date);
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
              <th>Actions</th>
              <th>Student Name</th>
              {dates.map((date, index) => (
                <th key={index}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record.id}>
                <td>
                  {/* Action buttons can be added here */}
                </td>
                <td>{record.student_name}</td>
                {dates.map((date, idx) => {
                  const isMatch =
                    new Date(record.attendance_date).toLocaleDateString('en-US') === date;
                  return (
                    <td key={idx}>
                      {isMatch ? (record.present ? 'Present' : 'Absent') : ''}
                    </td>
                  );
                })}
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
        className="date-select"
        onChange={(e) => handleDateSelect(e.target.value)}
        value={selectedDate}
      >
        <option value="">Select a Date</option>
        {dates.map((date, idx) => (
          <option key={idx} value={date}>
            {date}
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
