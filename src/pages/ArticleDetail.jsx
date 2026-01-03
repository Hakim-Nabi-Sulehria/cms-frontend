// src/pages/ArticleDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchArticle, 
  clearCurrentArticle,
  clearError,
  deleteArticle 
} from '../store/articleSlice';
import { logoutUser } from '../store/authSlice';
import Layout from '../components/layout/Layout';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaCalendar,
  FaEye,
  FaEyeSlash,
  FaPrint,
  FaShare
} from 'react-icons/fa';
import { canEditArticle, canDeleteArticle } from '../utils/constants';
import toast from 'react-hot-toast';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { currentArticle, loading, error } = useSelector(state => state.articles);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      console.log('Loading article detail for ID:', id);
      dispatch(fetchArticle(id));
    }

    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      
      if (error.includes('401') || error.includes('Unauthorized')) {
        dispatch(logoutUser());
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.includes('not found')) {
        toast.error('Article not found');
        navigate('/dashboard');
      }
      
      dispatch(clearError());
    }
  }, [error, dispatch, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteArticle(id)).unwrap();
        toast.success('Article deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err || 'Failed to delete article');
        setIsDeleting(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentArticle?.title,
        text: currentArticle?.content?.replace(/<[^>]*>/g, '').substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h3>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or you don't have access to it.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(currentArticle.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Articles
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {currentArticle.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span className="font-medium">{currentArticle.author?.name}</span>
                </div>
                
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>{formattedDate}</span>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  currentArticle.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentArticle.status === 'PUBLISHED' ? (
                    <span className="flex items-center">
                      <FaEye className="mr-1" />
                      Published
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaEyeSlash className="mr-1" />
                      Draft
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {canEditArticle(currentArticle, user) && (
                <Link
                  to={`/articles/${id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </Link>
              )}
              
              {canDeleteArticle(user) && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  <FaTrash className="mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
              
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaPrint className="mr-2" />
                Print
              </button>
              
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaShare className="mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: currentArticle.content }}
          />
        </div>

        {/* Article Meta Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Author</p>
              <p className="font-medium">{currentArticle.author?.name}</p>
              <p className="text-sm text-gray-500">{currentArticle.author?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">
                {new Date(currentArticle.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-medium ${
                currentArticle.status === 'PUBLISHED' 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {currentArticle.status}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaArrowLeft className="mr-2" />
            Back to All Articles
          </Link>
          
          {canEditArticle(currentArticle, user) && (
            <Link
              to={`/articles/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <FaEdit className="mr-2" />
              Edit Article
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ArticleDetail;