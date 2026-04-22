import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await login({ email, password });
    console.log("Response:", data);

    if (data.token) {
      alert("Login successful");
      navigate("/");
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("ERROR:", err);
    alert("Something broke — check console");
  }
};
}
export default Login;