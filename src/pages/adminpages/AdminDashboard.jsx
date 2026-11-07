import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "../../utils/ProductContext";
// Import Icon dari lucide-react
import { 
  Package, 
  BarChart3, 
  Tag, 
  Wallet, 
  AlertTriangle, 
  ArrowRight 
} from "lucide-react";

export default function AdminDashboard() {
  const { products = [], isLoading, isError, getCategories } = useProducts();

  // Load data kategori untuk statistik
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) return <p className="p-6">Loading dashboard data...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading dashboard data.</p>;

  // Perhitungan Statistik ringkas dari data produk
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);
  const totalValue = products.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.stock) || 0),
    0
  );
  const lowStockProducts = products.filter((item) => Number(item.stock) <= 5);

  return (
    <div className="space-y-6">
      {/* Header Selamat Datang */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Selamat datang kembali! Berikut adalah ikhtisar toko kamu hari ini.</p>
      </div>

      {/* --- KARTU STATISTIK (STAT CARDS DENGAN ICON) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produk */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Produk</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalProducts}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Stok */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Stok Item</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalStock}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Kategori */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Kategori</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{categories.length}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Nilai Inventaris */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Estimasi Nilai Stok</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">
              Rp {totalValue.toLocaleString("id-ID")}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* --- GRID INFORMASI PRODUK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TABEL PRODUK TERBARU */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Produk Terbaru</h2>
            <Link to="/admin/products" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase">
                  <th className="py-3 px-2">Produk</th>
                  <th className="py-3 px-2">Kategori</th>
                  <th className="py-3 px-2">Harga</th>
                  <th className="py-3 px-2">Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-2 flex items-center space-x-3">
                      <img
                        src={p.img_url}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                      />
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {p.category?.name || "Tanpa Kategori"}
                    </td>
                    <td className="py-3 px-2 font-medium text-gray-700">
                      Rp {Number(p.price).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${
                          p.stock <= 5
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {p.stock} pcs
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WIDGET PERINGATAN STOK MENIPIS */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-800">Peringatan Stok Menipis</h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl text-center">
              Semua stok produk masih dalam kondisi aman.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-red-50/60 rounded-xl border border-red-100"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.img_url}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-red-500 font-medium">Sisa Stok: {item.stock}</p>
                    </div>
                  </div>
                  <Link
                    to={`/admin/edit-product/${item.id}`}
                    className="text-xs bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-50"
                  >
                    Restok
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}