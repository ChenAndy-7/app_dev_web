import React, { useEffect, useState } from 'react';
import './attendance.css';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [newAttendance, setNewAttendance] = useState({
    student_name: '',
    attendance_date: '',
    status: 'Present',
    attendance_id: null,
  });

  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });
  const [dates, setDates] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

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
    const presentCount = data.filter((record) => record.status === 'Present').length;
    const absentCount = data.filter((record) => record.status === 'Absent').length;
    setAttendanceStats({ present: presentCount, absent: absentCount });
  };

  const generateDates = (data: any[]) => {
    const dateSet = new Set<string>();
    data.forEach((record) => {
      const formattedDate = new Date(record.attendance_date).toLocaleDateString('en-US');
      dateSet.add(formattedDate);
    });
    setDates([...dateSet].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const method = newAttendance.attendance_id ? 'PUT' : 'POST';
    const url = newAttendance.attendance_id
      ? `http://localhost:5175/api/attendance/${newAttendance.attendance_id}`
      : 'http://localhost:5175/api/attendance';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAttendance),
    })
      .then((response) => response.json())
      .then(() => {
        fetchAttendanceData();
        setNewAttendance({
          student_name: '',
          attendance_date: '',
          status: 'Present',
          attendance_id: null,
        });
      })
      .catch((error) => console.error('Error saving attendance:', error));
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:5175/api/attendance/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchAttendanceData();
      })
      .catch((error) => console.error('Error deleting attendance:', error));
  };

  const handleEdit = (record: any) => {
    setNewAttendance({
      student_name: record.student_name,
      attendance_date: new Date(record.attendance_date).toISOString().split('T')[0],
      status: record.status,
      attendance_id: record.id,
    });
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

  return (
    <div className="attendance-container">
      <h1>Attendance</h1>
      <div className="flex-container">
        <form
          className="form-container"
          onSubmit={handleFormSubmit}
        >
          <div>
            <label>Student Name:</label>
            <input
              type="text"
              name="student_name"
              value={newAttendance.student_name}
              onChange={(e) =>
                setNewAttendance((prev) => ({ ...prev, student_name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label>Attendance Date:</label>
            <input
              type="date"
              name="attendance_date"
              value={newAttendance.attendance_date}
              onChange={(e) =>
                setNewAttendance((prev) => ({ ...prev, attendance_date: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={newAttendance.status}
              onChange={(e) =>
                setNewAttendance((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button type="submit">
            {newAttendance.attendance_id ? 'Update' : 'Add'} Attendance
          </button>
        </form>
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
                  <button onClick={() => handleEdit(record)}>Edit</button>
                  <button onClick={() => handleDelete(record.id)}>Delete</button>
                </td>
                <td>{record.student_name}</td>
                {dates.map((date, idx) => (
                  <td key={idx}>
                    {new Date(record.attendance_date).toLocaleDateString('en-US') === date
                      ? record.status
                      : 'N/A'}
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
      </div>
    </div>
  );
};

export default Attendance;