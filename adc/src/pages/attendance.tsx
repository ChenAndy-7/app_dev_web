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
  const [studentStats, setStudentStats] = useState({ present: 0, absent: 0 });

  const [dates, setDates] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:5175/api/attendance')
      .then((response) => response.json())
      .then((data) => {
        setAttendanceData(data);
        updateAttendanceStats(data);
        generateDates(data);
      })
      .catch((error) => console.error('Error fetching attendance data:', error));
  }, []);

  const updateAttendanceStats = (data: any[]) => {
    const presentCount = data.filter((record) => record.status === 'Present').length;
    const absentCount = data.filter((record) => record.status === 'Absent').length;
    setAttendanceStats({ present: presentCount, absent: absentCount });
  };

  const updateStudentStats = (studentName: string) => {
    const studentRecords = attendanceData.filter(
      (record) => record.student_name === studentName
    );
    const presentCount = studentRecords.filter((record) => record.status === 'Present').length;
    const absentCount = studentRecords.filter((record) => record.status === 'Absent').length;
    setStudentStats({ present: presentCount, absent: absentCount });
  };

  const generateDates = (data: any[]) => {
    const dateSet = new Set<string>();
    data.forEach((record) => {
      const formattedDate = new Date(record.attendance_date).toLocaleDateString('en-US');
      dateSet.add(formattedDate);
    });
    setDates([...dateSet].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()));
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSelectedStudent(selectedName);
    updateStudentStats(selectedName);
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

  const studentPieChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [studentStats.present, studentStats.absent],
        backgroundColor: ['#2196f3', '#ff9800'], // Blue for Present, Orange for Absent
        hoverBackgroundColor: ['#64b5f6', '#ffb74d'],
      },
    ],
  };

  return (
    <div className="attendance-container">
      <h1>Attendance</h1>
      <div className="flex-container">
        <form className="form-container">
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
              <option value="Late">Late</option>
            </select>
          </div>
          <button type="submit">Add Attendance</button>
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
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
                <td>{record.student_name}</td>
                {dates.map((date, idx) => (
                  <td key={idx}>
                    {record.attendance_date === date ? record.status : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-wrapper">
  {/* Overall attendance chart */}
  <div className="chart-container">
    <h3>Overall Attendance</h3>
    <Pie data={pieChartData} />
  </div>

{/* Individual student attendance chart with dropdown */}
<div className="chart-container individual">
  <div className="individual-wrapper">
    <div>
      <h3>Individual Attendance</h3>
      {selectedStudent && <Pie data={studentPieChartData} />}
    </div>
    <select
      value={selectedStudent}
      onChange={handleStudentSelect}
      className="dropdown"
    >
      <option value="">Select a Student</option>
      {[...new Set(attendanceData.map((record) => record.student_name))].map(
        (student, idx) => (
          <option key={idx} value={student}>
            {student}
          </option>
        )
      )}
    </select>
    {/* Display present and absent stats under the dropdown */}
    {selectedStudent && (
      <div className="attendance-stats">
        <p>Present: {studentStats.present}</p>
        <p>Absent: {studentStats.absent}</p>
      </div>
    )}
  </div>
</div>
</div>


      </div>
  );
};

export default Attendance;
