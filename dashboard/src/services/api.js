import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getSessions = async (page = 1, limit = 10) => {
  const response = await api.get('/sessions', { params: { page, limit } });
  return response.data;
};

export const getSessionEvents = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data;
};

export const getHeatmapData = async (pageUrl) => {
  const response = await api.get(`/heatmap`, { params: { pageUrl } });
  return response.data;
};

export default api;
