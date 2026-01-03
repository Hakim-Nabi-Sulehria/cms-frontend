// src/pages/PublicArticles.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaNewspaper, 
  FaLock, 
  FaEdit, 
  FaUserShield,
  FaUserEdit,
  FaUser,
  FaSearch,
  FaCalendar,
  FaUserCircle
} from 'react-icons/fa';
import { fetchPublicArticles } from '../store/articleSlice';
import toast from 'react-hot-toast';

const PublicArticles = () => {
  const dispatch = useDispatch();
  const { articles, loading, pagination } = useSelector(state => state.articles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm]);

  const loadArticles = async (page = 1) => {
    try {
      await dispatch(fetchPublicArticles({ page, limit: 10 })).unwrap();
    } catch (error) {
      toast.error('Failed to load articles. Please try again later.');
      console.error('Error loading public articles:', error);
    }
  };

  const filterArticles = () => {
    if (!searchTerm.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = articles.filter(article => 
      article.title?.toLowerCase().includes(term) ||
      article.content?.toLowerCase().includes(term) ||
      article.author?.name?.toLowerCase().includes(term)
    );
    setFilteredArticles(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterArticles();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FaNewspaper className="h-8 w-8 text-primary-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">CMS Workspace</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <FaLock className="mr-2" />
                Login to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Content Management
            <span className="block text-primary-600 mt-2">For Teams</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A professional content management system with role-based access control. 
            Publish, manage, and collaborate on content with your team securely.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Get Started
            </Link>
            <Link
              to="#articles"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Articles
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Role-Based Access Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <FaUserShield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Admin</h3>
              </div>
              <p className="text-gray-700 mb-4">Full system control with complete access to all features:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Create, edit, delete all articles
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Manage user roles and permissions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Full system administration
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-green-600 p-3 rounded-lg">
                  <FaUserEdit className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Editor</h3>
              </div>
              <p className="text-gray-700 mb-4">Content creation and management capabilities:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Create and publish articles
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Edit own articles
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  View all published content
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-purple-600 p-3 rounded-lg">
                  <FaUser className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Viewer</h3>
              </div>
              <p className="text-gray-700 mb-4">Read-only access to published content:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  View published articles
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  Search and filter content
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  Read-only access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Published Articles</h2>
          <p className="text-xl text-gray-600">
            Browse our latest published content
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="submit"
                className="text-primary-600 hover:text-primary-700"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <FaNewspaper className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 text-lg mb-6">
                {searchTerm 
                  ? 'No articles match your search criteria'
                  : 'No published articles available yet'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors duration-200">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-gray-600 space-x-6">
                        <div className="flex items-center">
                          <FaUserCircle className="mr-2" />
                          <span className="font-medium">{article.author?.name || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendar className="mr-2" />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      article.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  
                  <div 
                    className="text-gray-700 text-lg mb-6 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {Math.ceil(article.content?.length / 1000) || 1} min read
                    </div>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                    >
                      Login to read full article
                      <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demo Account Info */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Try Our Demo Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-bold text-gray-900 mb-2">Admin Account</h4>
              <p className="text-gray-600 text-sm mb-2">Full system access</p>
              <p className="font-mono text-primary-600">admin@example.com</p>
              <p className="font-mono text-gray-500">password123</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-bold text-gray-900 mb-2">Editor Account</h4>
              <p className="text-gray-600 text-sm mb-2">Content creation access</p>
              <p className="font-mono text-primary-600">editor@example.com</p>
              <p className="font-mono text-gray-500">password123</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-bold text-gray-900 mb-2">Viewer Account</h4>
              <p className="text-gray-600 text-sm mb-2">Read-only access</p>
              <p className="font-mono text-primary-600">viewer@example.com</p>
              <p className="font-mono text-gray-500">password123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaNewspaper className="h-12 w-12 text-primary-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">CMS Workspace</h3>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              A professional content management system built with modern technologies for secure team collaboration.
            </p>
            <div className="flex justify-center space-x-6">
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                Login
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="#articles" className="text-gray-400 hover:text-white transition-colors">
                Articles
              </Link>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">© 2024 CMS Workspace</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicArticles;