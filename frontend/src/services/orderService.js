import API from './api';

export const createOrder = async (orderData) => {
  const { data } = await API.post('/orders', orderData);
  return data;
};

export const fetchMyOrders = async () => {
  const { data } = await API.get('/orders/myorders');
  return data;
};

export const fetchAllOrdersAdmin = async () => {
  const { data } = await API.get('/orders');
  return data;
};