import { Outlet, Navigate, useNavigate } from "react-router-dom"; 
import Sidebar from "../components/Sidebar"; 
import { useState } from "react"; 
import { useAuth } from "../utils/AuthContext";
import toast from "react-hot-toast";

export default function AdminLayout() { 
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // Jika belum login (tidak ada token), lempar ke halaman /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    toast.success("Berhasil logout!");
    navigate("/login");
  };

  return ( 
    <div className="flex h-screen bg-gray-100"> 
      {/* Sidebar Component */} 
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> 

      {/* Main content */} 
      <div className="flex-1 flex flex-col"> 
        {/* Top bar */} 
        <div className="bg-white shadow p-4 flex justify-between items-center"> 
          <div className="flex items-center gap-2">
            <button 
              className="md:hidden p-2 border rounded" 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
            > 
              ☰ 
            </button> 
            <h1 className="font-bold text-gray-700">My Admin</h1> 
          </div>

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </div> 

        {/* Page Content */} 
        <main className="flex-1 overflow-y-auto p-6"> 
          <Outlet /> 
        </main> 

        {/* Footer */} 
        <footer className="bg-white border-t p-4 text-center text-sm"> 
          © 2025 My Admin App — v1.0.0 
        </footer> 
      </div> 
    </div> 
  ); 
}