// src/pages/EditArticle.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ArticleForm from '../components/articles/ArticleForm';
import { 
  fetchArticle, 
  clearCurrentArticle,
  clearError 
} from '../store/articleSlice';
import { logoutUser } from '../store/authSlice';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { currentArticle, loading, error } = useSelector(state => state.articles);
  
  // Add refs to track state changes
  const hasLoadedRef = useRef(false);
  const articleIdRef = useRef(null);

  // Load article only once when component mounts or id changes
  useEffect(() => {
    if (!id) return;
    
    // Don't reload if we already have this article
    if (hasLoadedRef.current && articleIdRef.current === id) {
      console.log('Already loaded article', id, 'skipping reload');
      return;
    }
    
    console.log('Loading article ID:', id);
    hasLoadedRef.current = true;
    articleIdRef.current = id;
    
    const load = async () => {
      try {
        await dispatch(fetchArticle(id)).unwrap();
        console.log('Article loaded successfully');
      } catch (err) {
        console.error('Error loading article:', err);
      }
    };
    
    load();

    return () => {
      // Only clear if we're navigating away from edit
      // Not when component re-renders
      if (!window.location.pathname.includes('/articles/') || 
          !window.location.pathname.includes('/edit')) {
        dispatch(clearCurrentArticle());
      }
    };
  }, [id, dispatch]);

  // Handle errors - but only once
  useEffect(() => {
    if (error && !hasLoadedRef.current) {
      console.log('EditArticle Error:', error);
      
      // If unauthorized, logout
      if (error.includes('401') || error.includes('Unauthorized')) {
        dispatch(logoutUser());
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.includes('not found') || error.includes('NotFound')) {
        toast.error('Article not found');
        navigate('/dashboard');
      } else {
        toast.error(error);
      }
      
      dispatch(clearError());
    }
  }, [error, dispatch, navigate]);

  // Check if user has permission to edit this article - only once
  useEffect(() => {
    if (currentArticle && user && !hasLoadedRef.current) {
      console.log('Checking permissions for article:', currentArticle.id);
      const isOwner = currentArticle.author?.id === user.id || currentArticle.authorId === user.id;
      const isAdmin = user.role === 'ADMIN';
      
      if (!isOwner && !isAdmin) {
        toast.error('You do not have permission to edit this article');
        navigate('/dashboard');
      }
    }
  }, [currentArticle, user, navigate]);

  // Debug: Log state changes but prevent infinite logs
  const prevStateRef = useRef({ loading, currentArticle: null });
  useEffect(() => {
    const prev = prevStateRef.current;
    const curr = { loading, currentArticle: currentArticle?.id };
    
    // Only log if state actually changed
    if (prev.loading !== curr.loading || prev.currentArticle !== curr.currentArticle) {
      console.log('EditArticle State Change:', {
        id,
        loading: curr.loading,
        hasCurrentArticle: !!currentArticle,
        currentArticleId: curr.currentArticle,
        error
      });
    }
    
    prevStateRef.current = curr;
  }, [id, loading, currentArticle, error]);

  // Show loading only on initial load
  if (loading && !currentArticle) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentArticle && !loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-600 mb-4">
              <svg className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Article not found</h3>
            <p className="text-gray-600 mb-4">The article you're trying to edit doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
              <p className="mt-2 text-gray-600">
                Make changes to your article
                {currentArticle.author && (
                  <span className="ml-2 text-sm text-gray-500">
                    • Created by: {currentArticle.author.name}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentArticle.status === 'PUBLISHED' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentArticle.status}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(currentArticle.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <ArticleForm isEdit={true} />
      </div>
    </Layout>
  );
};

export default EditArticle;