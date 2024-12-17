import React, { useState, useEffect } from 'react';
import './App.css';
import EmployeeStatistics from './EmployeeStatistics'; // Import the EmployeeStatistics component
import AttendanceTracker from './AttendanceTracker'; // Import the AttendanceTracker component

function App() {
  const [formData, setFormData] = useState({
    name: '',
    emp_id: '',
    email: '',
    phonenum: '',
    dept: '',
    doj: '',
    role: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employees, setEmployees] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const depts = ['HR', 'Engineering', 'Marketing'];

  useEffect(() => {
    // Fetch existing employees from the server when the component mounts
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/getEmployees');
        const result = await response.json();
        if (response.status === 200) {
          setEmployees(result.employees);
        } else {
          setError('Failed to load employees.');
        }
      } catch (error) {
        setError('Error fetching employees from server.');
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setError('');
    setSuccess('');

    e.preventDefault();

    if (!formData.name || !formData.emp_id || !formData.email || !formData.dept || !formData.doj || !formData.role || !formData.phonenum) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.status === 201) {
        setSuccess(result.message);
        setError('');
        setFormData({
          name: '',
          emp_id: '',
          email: '',
          phonenum: '',
          dept: '',
          doj: '',
          role: '',
        });
        setEmployees((prev) => [...prev, formData]); // Update the employees list with the new employee
      } else {
        setError(result.message);
        setSuccess('');
      }
    } catch (error) {
      setError('Error connecting to server');
      setSuccess('');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      emp_id: '',
      email: '',
      phonenum: '',
      dept: '',
      doj: '',
      role: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="App">
      <h1>Employee Management System</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        </div>

        <div className='form-group'>
          <label htmlFor='emp_id'>Employee ID</label>
          <input type="text" name="emp_id" value={formData.emp_id} onChange={handleChange} placeholder="Employee ID" />
        </div>

        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        </div>

        <div className='form-group'>
          <label htmlFor='phonenum'>Phone Number</label>
          <input type="number" name="phonenum" value={formData.phonenum} onChange={handleChange} placeholder="Phone Number" min="1000000000" max="9999999999" />
        </div>

        <div className='form-group'>
          <label htmlFor='dept'>Department</label>
          <select name="dept" value={formData.dept} onChange={handleChange}>
            <option value="">Select Department</option>
            {depts.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          <label htmlFor='doj'>Date of Joining</label>
          <input type="date" name="doj" value={formData.doj} onChange={handleChange} max={today} />
        </div>

        <div className='form-group'>
          <label htmlFor='role'>Role</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" />
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      {/* Integrate EmployeeStatistics here */}
      <EmployeeStatistics />

      {/* Integrate AttendanceTracker here */}
      <AttendanceTracker employees={employees} />
    </div>
  );
}

export default App;
