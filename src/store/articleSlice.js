// src/store/articleSlice.js (Complete version)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { articleService } from '../services/articleService';

// Async thunks
export const fetchArticles = createAsyncThunk(
  'articles/fetchAll',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      return await articleService.getArticles(page, limit, filters);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchArticle = createAsyncThunk(
  'articles/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await articleService.getArticle(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPublicArticles = createAsyncThunk(
  'articles/fetchPublic',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      return await articleService.getPublicArticles(page, limit);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/create',
  async (articleData, { rejectWithValue }) => {
    try {
      return await articleService.createArticle(articleData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await articleService.updateArticle(id, updates);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/delete',
  async (id, { rejectWithValue }) => {
    try {
      await articleService.deleteArticle(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyArticles = createAsyncThunk(
  'articles/fetchMy',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      return await articleService.getMyArticles(page, limit);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  articles: [],
  currentArticle: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || [];
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 0,
          hasNextPage: action.payload.pagination?.hasNextPage || false,
          hasPrevPage: action.payload.pagination?.hasPrevPage || false,
        };
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.articles = [];
      })
      
      // Fetch single article
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentArticle = null;
      })
      
      // Fetch public articles
      .addCase(fetchPublicArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || [];
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 0,
          hasNextPage: action.payload.pagination?.hasNextPage || false,
          hasPrevPage: action.payload.pagination?.hasPrevPage || false,
        };
      })
      .addCase(fetchPublicArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.articles = [];
      })
      
      // Create article
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = [action.payload, ...state.articles];
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update article
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        // Update in articles array
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
        // Update current article if it's the one being edited
        if (state.currentArticle?.id === action.payload.id) {
          state.currentArticle = action.payload;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete article
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = state.articles.filter(article => article.id !== action.payload);
        if (state.currentArticle?.id === action.payload) {
          state.currentArticle = null;
        }
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch my articles
      .addCase(fetchMyArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || [];
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 0,
          hasNextPage: action.payload.pagination?.hasNextPage || false,
          hasPrevPage: action.payload.pagination?.hasPrevPage || false,
        };
      })
      .addCase(fetchMyArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.articles = [];
      });
  },
});

export const { clearCurrentArticle, clearError, setArticles } = articleSlice.actions;
export default articleSlice.reducer;