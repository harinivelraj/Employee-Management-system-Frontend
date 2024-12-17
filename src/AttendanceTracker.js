import React, { useState } from 'react';

function AttendanceTracker({ employees }) {
  const [attendance, setAttendance] = useState({});

  const handleAttendanceChange = (emp_id, status) => {
    setAttendance({
      ...attendance,
      [emp_id]: status,
    });
  };

  const handleSubmitAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      alert('Please mark attendance before submitting!');
      return;
    }

    try {
      // Send the attendance data to the server or handle it as needed.
      console.log('Attendance submitted:', attendance);
      
      // Example: sending the attendance data to a backend API
      const response = await fetch('http://localhost:5000/submitAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendance }),
      });

      const result = await response.json();

      if (response.status === 200) {
        alert('Attendance submitted successfully!');
      } else {
        alert('Error submitting attendance: ' + result.message);
      }
    } catch (error) {
      console.error('Error during attendance submission:', error);
      alert('Error submitting attendance!');
    }
  };

  return (
    <div className="attendance-tracker">
      <style>
        {`
          .attendance-tracker {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
          }

          .attendance-tracker h2 {
            text-align: center;
            color: #4CAF50;
          }

          .attendance-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            border: 1px solid #ddd;
          }

          .attendance-table th, .attendance-table td {
            padding: 12px;
            text-align: center;
          }

          .attendance-table th {
            background-color: #4CAF50;
            color: white;
          }

          .attendance-table td {
            background-color: #f1f1f1;
          }

          .attendance-table td select {
            width: 100px;
            padding: 5px;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #ccc;
            background-color: white;
          }

          .attendance-table td select:focus {
            outline: none;
            border-color: #4CAF50;
          }

          .submit-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
            display: block;
            width: 100%;
          }

          .submit-btn:hover {
            background-color: #45a049;
          }

          .submit-btn:active {
            background-color: #3e8e41;
          }
        `}
      </style>
      <h2>Attendance Tracker</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Employee ID</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.emp_id}>
              <td>{employee.name}</td>
              <td>{employee.emp_id}</td>
              <td>
                <select
                  value={attendance[employee.emp_id] || ''}
                  onChange={(e) => handleAttendanceChange(employee.emp_id, e.target.value)}
                  className="attendance-select"
                >
                  <option value="">Select</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="submit-btn" onClick={handleSubmitAttendance}>Submit Attendance</button>
    </div>
  );
}

export default AttendanceTracker;
