import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      if (res.data.success) {
        if (res.data.role === "admin") navigate("/home");
        else if (res.data.role === "doctor") navigate("/doctor");
        else navigate("/appointment");
      } else {
        setMsg("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>TimeCare Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'inline-block', marginTop: 20 }}>
        <div><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div style={{ marginTop: 8 }}><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Login</button>
        </div>
      </form>
      <p style={{ color: 'red' }}>{msg}</p>
      <p><a href="/appointment">Book an appointment as patient</a></p>
    </div>
  );
}
