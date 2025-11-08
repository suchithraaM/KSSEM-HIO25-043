// frontend/src/pages/Appointment.jsx
import React, { useState } from "react";

export default function Appointment() {
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    department: "General",
    cause: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // change this default code if your user base is outside India
  const DEFAULT_COUNTRY_PREFIX = "+91";

  const normalizePhone = (phone) => {
    if (!phone) return phone;
    const trimmed = phone.trim();
    if (trimmed.startsWith("+")) {
      // remove spaces and other non-digit except leading +
      return "+" + trimmed.replace(/[^\d]/g, "").replace(/^\+/, "");
    }
    // remove non-digits and add default country code
    const digits = trimmed.replace(/\D/g, "");
    return DEFAULT_COUNTRY_PREFIX + digits;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMsg(null);

    // basic client validation
    if (!form.patientName || !form.phone || !form.email || !form.department || !form.cause) {
      setSubmitError("Please fill all fields.");
      return;
    }

    const payload = {
      patientName: form.patientName,
      phone: normalizePhone(form.phone),
      email: form.email,
      department: form.department,
      cause: form.cause
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/appointment/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        // non-json response
        throw new Error(`Server returned status ${res.status} with non-JSON body`);
      }

      if (!res.ok || !data.success) {
        // show helpful message from backend when available
        const msg = (data && (data.message || data.error)) ? (data.message || data.error) : `Server error (status ${res.status})`;
        setSubmitError(msg);
        console.error("Booking failed response:", data);
        setLoading(false);
        return;
      }

      // success
      setSuccessMsg(`Appointment booked — token: ${data.appointment?.tokenNumber || "N/A"} | Estimated wait: ${data.appointment?.predictedWait || "N/A"}`
);

      setForm({
        patientName: "",
        phone: "",
        email: "",
        department: "General",
        cause: ""
      });
    } catch (err) {
      console.error("Booking failed (network or server):", err);
      setSubmitError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", textAlign: "center" }}>
      <h1>Book Appointment</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          name="patientName"
          placeholder="Full name"
          value={form.patientName}
          onChange={handleChange}
          style={{ padding: 8 }}
        />

        <div style={{ display: "flex", gap: 8 }}>
          {/* optional visual hint for country code — not required */}
          <span style={{ alignSelf: "center" }}>+91</span>
          <input
            name="phone"
            placeholder="Phone (enter local or +countrynumber)"
            value={form.phone}
            onChange={handleChange}
            style={{ padding: 8, flex: 1 }}
          />
        </div>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ padding: 8 }}
        />

        <select name="department" value={form.department} onChange={handleChange} style={{ padding: 8 }}>
          <option>General</option>
          <option>Cardiology</option>
          <option>Pediatrics</option>
          <option>Orthopedics</option>
          {/* add other departments if needed */}
        </select>

        <textarea
          name="cause"
          placeholder="Reason for visit"
          value={form.cause}
          onChange={handleChange}
          rows={4}
          style={{ padding: 8 }}
        />

        <button type="submit" disabled={loading} style={{ padding: 8 }}>
          {loading ? "Booking..." : "Book"}
        </button>
      </form>

      {submitError && (
        <div style={{ color: "crimson", marginTop: 12 }}>
          Server error: {submitError}
        </div>
      )}

      {successMsg && (
        <div style={{ color: "green", marginTop: 12 }}>
          {successMsg}
        </div>
      )}
    </div>
  );
}
