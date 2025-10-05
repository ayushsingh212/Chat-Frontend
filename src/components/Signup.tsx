import { useState } from "react";
import { signup } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(form);
      alert("User registered!");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
      <button type="submit">Sign Up</button>
      <Link to="/login">Login</Link>
    </form>
  );
}
