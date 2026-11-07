import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success("Login berhasil!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login gagal. Periksa kembali data Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-700 text-center">Login Admin</h2>
        
        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            required
            className="w-full border rounded-lg p-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            required
            className="w-full border rounded-lg p-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Memproses..." : "Login"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Belum punya akun? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Daftar</Link>
        </p>
      </form>
    </div>
  );
}