import API from './api';

export const fetchProducts = async (keyword = '', category = '') => {
  const { data } = await API.get(`/products?keyword=${keyword}&category=${category}`);
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await API.post('/products', productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};