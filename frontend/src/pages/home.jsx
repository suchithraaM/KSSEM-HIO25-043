import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/appointment/all")
      .then(res => { if (res.data.success) setAppointments(res.data.data); })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Admin Dashboard</h2>
      <table border="1" style={{ margin: 'auto', marginTop: 12 }}>
        <thead><tr><th>Patient</th><th>Department</th><th>Token</th><th>Wait</th><th>Status</th></tr></thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a._id}>
              <td>{a.patientName}</td>
              <td>{a.department}</td>
              <td>{a.tokenNumber}</td>
              <td>{a.predictedWait} mins</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
