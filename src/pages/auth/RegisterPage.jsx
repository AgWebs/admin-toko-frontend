import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-700 text-center">Registrasi Akun</h2>

        <div>
          <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg p-2 text-sm mt-1"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            required
            className="w-full border rounded-lg p-2 text-sm mt-1"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            required
            className="w-full border rounded-lg p-2 text-sm mt-1"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Konfirmasi Password</label>
          <input
            type="password"
            required
            className="w-full border rounded-lg p-2 text-sm mt-1"
            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Memproses..." : "Daftar Akun"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}