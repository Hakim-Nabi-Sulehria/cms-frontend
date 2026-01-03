// src/services/articleService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const articleService = {
  getArticles: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      
      // Remove undefined filters
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await api.get('/articles', { params });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch articles');
    }
  },

  getPublicArticles: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/articles/public', {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch articles');
    }
  },

  getArticle: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch article');
    }
  },

  createArticle: async (article) => {
    try {
      const response = await api.post('/articles', article);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 
                          error.response?.data?.message || 
                          'Failed to create article';
      throw new Error(errorMessage);
    }
  },

  updateArticle: async (id, updates) => {
    try {
      const response = await api.put(`/articles/${id}`, updates);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 
                          error.response?.data?.message || 
                          'Failed to update article';
      throw new Error(errorMessage);
    }
  },

  deleteArticle: async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      return id;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete article');
    }
  },

  getMyArticles: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/articles/my-articles', {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch your articles');
    }
  },
};