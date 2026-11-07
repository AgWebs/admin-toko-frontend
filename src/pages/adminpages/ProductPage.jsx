import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; 
import toast from "react-hot-toast"; 
import { useProducts } from "../../utils/ProductContext";

const ProductPage = () => {
  const {
    products,
    meta,
    isLoading,
    isError,
    deleteProduct,
    getCategories,
    page,
    setPage,
    setKeyword,
    setCategoryId,
  } = useProducts();

  // Load data kategori untuk filter dropdown[cite: 18, 19]
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Local state form pencarian
  const [searchInput, setSearchInput] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset ke halaman 1 saat pencarian baru dilakukan
    setKeyword(searchInput);
    setCategoryId(selectedCat);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus produk ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produk berhasil dihapus!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus produk.");
    }
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-500">Error loading products.</p>;

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h1 className="text-xl font-bold mb-4">Manajemen Produk</h1>

      {/* --- FORM FILTER & SEARCH BAR ---[cite: 19, 20] */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
          {/* Dropdown Filter Kategori */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category}
              </option>
            ))}
          </select>

          {/* Input Kata Kunci */}
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border rounded-md p-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Tombol Cari */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition duration-200"
          >
            Cari
          </button>
        </form>

        {/* Tombol Tambah Produk */}
        <Link
          to="/admin/add-product"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition duration-200 text-center"
        >
          + Tambah Produk
        </Link>
      </div>

      {/* --- TABEL DAFTAR PRODUK ---*/}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Harga</th>
              <th className="p-2 border">Stok</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Tidak ada produk yang ditemukan.
                </td>
              </tr>
            ) : (
              products.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {/* Perhitungan nomor urut berbasis pagination */}
                    {((meta.current_page || 1) - 1) * (meta.per_page || 10) + index + 1}
                  </td>
                  <td className="p-2 border">
                    <img
                      src={p.img_url}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    {p.name} <br />
                    <small className="text-gray-500">
                      #{p.category?.name || "Tanpa Kategori"}
                    </small>
                  </td>
                  <td className="p-2 border">Rp. {p.price}</td>
                  <td className="p-2 border">{p.stock}</td>
                  <td className="p-2 border space-x-2">
                    <Link
                      to={`/admin/edit-product/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="cursor-pointer text-red-600 hover:underline ml-2"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROL ---*/}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50 text-sm hover:bg-gray-200"
          >
            Sebelumnya
          </button>

          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 border rounded text-sm ${
                page === pageNum
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={page === meta.last_page}
            onClick={() => setPage((prev) => Math.min(prev + 1, meta.last_page))}
            className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50 text-sm hover:bg-gray-200"
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductPage
