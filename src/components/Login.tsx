import { useState } from "react";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form);
       console.log("I am the incoming response",res)
      navigate("/rooms");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
