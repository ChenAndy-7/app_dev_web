import React, { useEffect, useState } from 'react';
import './attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [newAttendance, setNewAttendance] = useState({
    student_name: '',
    class_name: '',
    attendance_date: '',
    status: 'Present', // default status
  });

  // Fetch attendance data on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/attendance')
      .then((response) => response.json())
      .then((data) => setAttendanceData(data))
      .catch((error) => console.error('Error fetching attendance data:', error));
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAttendance((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Send the new attendance data to the backend
    fetch('http://localhost:5000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAttendance),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new data to the table (optimistic update)
        setAttendanceData((prevData) => [...prevData, data]);
        setNewAttendance({
          student_name: '',
          class_name: '',
          attendance_date: '',
          status: 'Present',
        }); // Clear the form after submission
      })
      .catch((error) => console.error('Error adding attendance data:', error));
  };

  return (
    <div>
      <h1>Attendance</h1>
      {/* Form to add new attendance record */}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Add Attendance</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Student Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Class Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((record, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{record.student_name}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{record.class_name}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{record.attendance_date}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{record.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '8px' }}>
                No attendance records available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
