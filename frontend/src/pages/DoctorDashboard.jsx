
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorDashboard() {
  const [department, setDepartment] = useState('General');
  const [appointments, setAppointments] = useState([]);

  const fetch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/appointment/department/${department}`);
      if (res.data.success) setAppointments(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); const iv = setInterval(fetch, 5000); return () => clearInterval(iv); }, [department]);

  const markCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointment/update/${id}`, { status: 'completed' });
      fetch();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Doctor Dashboard</h2>
      <div style={{ marginBottom: 10 }}>
        <label>Department: </label>
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option>General</option>
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Ophthalmology</option>
          <option>Orthopedics</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Patient</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Cause</th>
            <th>Predicted Wait</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a._id}>
              <td>{a.tokenNumber}</td>
              <td>{a.patientName}</td>
              <td>{a.phone}</td>
              <td>{a.department}</td>
              <td>{a.cause}</td>
              <td>{a.predictedWait} mins</td>
              <td>{a.status}</td>
              <td>
                {a.status !== 'completed' && (
                  <button onClick={() => markCompleted(a._id)}>Mark Completed</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

