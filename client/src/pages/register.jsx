import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // frontend validation
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.message || "❌ Registration failed");
      }
    } catch (err) {
    console.error(err);
    setMessage("❌ Server error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Register</h2>

      {message && <p>{message}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input name="firstName" placeholder="First Name" onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;