import axios from '../api/axios';
const BASE_URL = import.meta.env.VITE_API_URL
export const login = async (email, password) => {
  const response = await axios.post('/api/Auth/login', { email, password });
  return response.data;
};
export const register = async (data) => {
  const response = await axios.post('/api/Auth/Register', data);
  return response.data;
};
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('Không có refresh token');

  const res = await fetch(`${BASE_URL}/api/Auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!res.ok) throw new Error('Refresh token không hợp lệ');

  const data = await res.json();
  localStorage.setItem('Token', data.Token);
  return data.Token;
};
// services/userService.js
export const getCurrentUser = async (id = null) => {
  let token = localStorage.getItem('Token');
  const url = id
    ? `${BASE_URL}/api/Auth/current-user?userid=${id}`
    : `${BASE_URL}/api/Auth/current-user`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    localStorage.setItem('Token', token);

    const retryRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!retryRes.ok) throw new Error('Không lấy được thông tin người dùng sau khi refresh');
    return await retryRes.json();
  }

  if (!res.ok) throw new Error('Không lấy được thông tin người dùng');
  return await res.json();
};
export const updateUser = async (formData, role) => {
  const token = localStorage.getItem('Token');
  const response = await axios.put(`/api/Auth/update-user?role=${role}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
