import React, { createContext, useContext, useState } from "react"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

// Buat konteks
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // State untuk kontrol Search, Filter, dan Pagination
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // GET PRODUCTS WITH FILTERS & PAGINATION[cite: 19]
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ["products", page, keyword, categoryId],
    queryFn: async () => {
      const res = await apiClient.get("/products", {
        params: {
          page,
          keyword,
          category_id: categoryId,
        },
      });
      return res.data; 
    },
    keepPreviousData: true, 
  });

  // SHOW PRODUCT DETAIL
  const getProductById = async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  };

  // STORE PRODUCT
  const addProduct = async (formData) => {
    try {
      const response = await apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries(["products"]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // UPDATE PRODUCT
  const updateProduct = async (id, formData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      queryClient.invalidateQueries(["products"]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // DELETE PRODUCT
  const deleteProduct = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // SHOW CATEGORY DETAIL[cite: 17]
  const getCategories = async () => {
    const res = await apiClient.get("/categories");
    return res.data.data;
  };

  // EXPORT PROVIDER
  return (
    <ProductContext.Provider
      value={{
        products: productsData?.data || [], 
        meta: productsData?.meta || {},     
        isLoading,
        isError,
        page,
        setPage,
        keyword,
        setKeyword,
        categoryId,
        setCategoryId,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getCategories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);