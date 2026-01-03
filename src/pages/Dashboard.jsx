// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaUser, FaEdit, FaEye } from 'react-icons/fa';
import { fetchArticles, deleteArticle } from '../store/articleSlice';
import { logoutUser } from '../store/authSlice';
import ArticleCard from '../components/articles/ArticleCard';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { articles, loading, pagination } = useSelector(state => state.articles);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    myArticles: 0,
  });

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      const published = articles.filter(a => a.status === 'PUBLISHED').length;
      const draft = articles.filter(a => a.status === 'DRAFT').length;
      const myArticles = articles.filter(a => a.authorId === user?.id).length;
      
      setStats({
        total: articles.length,
        published,
        draft,
        myArticles,
      });
    }
  }, [articles, user?.id]);

  const loadArticles = async () => {
    try {
      await dispatch(fetchArticles({ page: 1, limit: 5 })).unwrap();
    } catch (error) {
      toast.error('Failed to load articles');
      
      // If unauthorized, logout
      if (error.includes('401') || error.includes('Unauthorized')) {
        dispatch(logoutUser());
        toast.error('Session expired. Please login again.');
      }
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await dispatch(deleteArticle(articleId)).unwrap();
        toast.success('Article deleted successfully');
        loadArticles(); // Reload articles
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}! Manage your articles here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <FaNewspaper className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                <FaEye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                <FaEdit className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                <FaUser className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Articles</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.myArticles}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Articles</h2>
              <Link
                to="/articles"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all →
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FaNewspaper className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-4 text-gray-600">No articles found</p>
                {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
                  <Link
                    to="/articles/new"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Create your first article
                  </Link>
                )}
              </div>
            ) : (
              articles.map((article) => (
                <div key={article.id} className="px-6 py-4">
                  <ArticleCard article={article} onDelete={handleDelete} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;