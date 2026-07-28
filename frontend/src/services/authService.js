import API from './api';

export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  return data;
};

export const registerUser = async (name, email, password) => {
  const { data } = await API.post('/auth/register', { name, email, password });
  return data;
};

export const getUserProfile = async () => {
  const { data } = await API.get('/auth/profile');
  return data;
};