import React, { useEffect, useState } from 'react';
import './attendance.css';
import { Pie } from 'react-chartjs-2'; // Importing Pie chart from Chart.js

// Import necessary Chart.js components
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [newAttendance, setNewAttendance] = useState({
    student_name: '',
    class_name: '',
    attendance_date: '',
    status: 'Present', // default status
    attendance_id: null, // This will be null when adding a new record
  });

  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
  });

  // Fetch attendance data on component mount
  useEffect(() => {
    fetch('http://localhost:5175/api/attendance') // This is the correct API endpoint
      .then((response) => response.json())
      .then((data) => {
        setAttendanceData(data);
        updateAttendanceStats(data);  // Update attendance stats
      })
      .catch((error) => console.error('Error fetching attendance data:', error));
  }, []);

  const updateAttendanceStats = (data: any[]) => {
    const presentCount = data.filter((record) => record.status === 'Present').length;
    const absentCount = data.filter((record) => record.status === 'Absent').length;
    setAttendanceStats({
      present: presentCount,
      absent: absentCount,
    });
  };

  const pieChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendanceStats.present, attendanceStats.absent],
        backgroundColor: ['#000000', '#808080'], // Black for Present, Gray for Absent
        hoverBackgroundColor: ['#333333', '#b0b0b0'], // Lighter black for Present, Light gray for Absent on hover
      },
    ],
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAttendance((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default form submission

    const url = newAttendance.attendance_id
      ? `http://localhost:5175/api/attendance/${newAttendance.attendance_id}` // PUT for edit
      : 'http://localhost:5175/api/attendance'; // POST for add

    const method = newAttendance.attendance_id ? 'PUT' : 'POST'; // Determine method based on whether it's an update or new

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAttendance), // Ensure 'newAttendance' is being used correctly here
    })
      .then((response) => response.json())
      .then((data) => {
        updateAttendanceStats([...attendanceData, data]);

        if (newAttendance.attendance_id) {
          setAttendanceData((prevData) =>
            prevData.map((record) =>
              record.attendance_id === newAttendance.attendance_id ? data : record
            )
          );
        } else {
          setAttendanceData((prevData) => [...prevData, data]);
        }

        setNewAttendance({
          student_name: '',
          class_name: '',
          attendance_date: '',
          status: 'Present',
          attendance_id: null,
        });
      })
      .catch((error) => console.error('Error saving attendance data:', error));
  };

  const handleDelete = (attendance_id: number) => {
    fetch(`http://localhost:5175/api/attendance/${attendance_id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setAttendanceData((prevData) =>
          prevData.filter((record) => record.attendance_id !== attendance_id)
        );
        console.log('Attendance record deleted');
      })
      .catch((error) => console.error('Error deleting attendance record:', error));
  };

  const handleEdit = (record: any) => {
    setNewAttendance({
      student_name: record.student_name,
      class_name: record.class_name,
      attendance_date: record.attendance_date,
      status: record.status,
      attendance_id: record.attendance_id,
    });
  };

  // Helper function to format the date
  const formatDate = (date: string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return d.toLocaleDateString('en-US', options); // This will format as MM/DD/YYYY
  };

  return (
    <div className="attendance-container">
      <h1>Attendance</h1>

      {/* Flex container for form and table */}
      <div className="flex-container">
        {/* Form to add new attendance record */}
        <form onSubmit={handleSubmit} className="form-container">
          <div>
            <label>Student Name:</label>
            <input
              type="text"
              name="student_name"
              value={newAttendance.student_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Class Name:</label>
            <input
              type="text"
              name="class_name"
              value={newAttendance.class_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Attendance Date:</label>
            <input
              type="date"
              name="attendance_date"
              value={newAttendance.attendance_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={newAttendance.status}
              onChange={handleInputChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
          <button type="submit">{newAttendance.attendance_id ? 'Update Attendance' : 'Add Attendance'}</button>
        </form>
      </div>

      {/* Table to display the attendance records */}
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Class Name</th>
            <th>Attendance Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{record.student_name}</td>
                <td>{record.class_name}</td>
                <td>{formatDate(record.attendance_date)}</td>
                <td>{record.status}</td>
                <td>
                  <button onClick={() => handleEdit(record)}>Edit</button>
                  <button onClick={() => handleDelete(record.attendance_id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No attendance records available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pie chart for attendance */}
      <div className="chart-container">
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Attendance;
