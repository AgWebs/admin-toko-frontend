import { useState } from 'react'
import './index.css'
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/frontpages/Dashboard';
import ProductDetail from './pages/frontpages/ProductDetail';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/adminpages/AdminDashboard';
import AboutPage from './pages/adminpages/AboutPage';
import Cart from './pages/frontpages/Cart';
import ProductForm from "./pages/adminpages/ProductForm";
import ProductEdit from "./pages/adminpages/ProductEdit";
import ProductPage from "./pages/adminpages/ProductPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

function App() { 
  return ( 
    <Routes>
      {/* Front Routes */}
      <Route path="/" element={<MainLayout/>} >
        <Route index element={<Dashboard />} /> 
        <Route path="product/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<Cart/>} />
      </Route>

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}> 
        <Route index element={<AdminDashboard />} /> 
        <Route path="dashboard" element={<AdminDashboard />} /> 
        <Route path="products" element={<ProductPage/>} />
        <Route path="about" element={<AboutPage />} /> 
        <Route path="add-product" element={<ProductForm />} />
        <Route path="edit-product/:id" element={<ProductEdit />} />
      </Route> 
    </Routes>

  ); 
}

export default App
