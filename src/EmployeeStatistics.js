import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EmployeeStatistics = () => {
  const [roleData, setRoleData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [error, setError] = useState('');
  const [showStats, setShowStats] = useState(false); // State to toggle stats visibility

  const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0'];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setRoleData(
          data.roles.map((role) => ({
            name: role.role,
            value: parseInt(role.count, 10),
          }))
        );
        setDeptData(
          data.departments.map((dept) => ({
            name: dept.dept,
            value: parseInt(dept.count, 10),
          }))
        );
        setError('');
      } catch (err) {
        console.error(err);
        setError('Error fetching statistics');
      }
    };

    if (showStats) fetchStatistics();
  }, [showStats]); // Only fetch data when showStats is true

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button
        onClick={() => setShowStats((prev) => !prev)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {showStats ? 'Hide Stats' : 'Show Stats'}
      </button>

      {showStats && (
        <div style={styles.container}>
          <h1 style={styles.header}>Employee Statistics</h1>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.chartsContainer}>
            {/* Pie Chart for Roles */}
            <div style={styles.chartWrapper}>
              <h2 style={styles.chartTitle}>Roles Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart for Departments */}
            <div style={styles.chartWrapper}>
              <h2 style={styles.chartTitle}>Departments Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  chartsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  chartWrapper: {
    flex: '1 1 45%',
    background: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#555',
  },
};

export default EmployeeStatistics;
