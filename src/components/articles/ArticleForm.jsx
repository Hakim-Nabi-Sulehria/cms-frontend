// src/components/articles/ArticleForm.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RichTextEditor from './RichTextEditor';
import { 
  createArticle, 
  updateArticle,
  clearError 
} from '../../store/articleSlice';
import toast from 'react-hot-toast';

const ArticleForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentArticle, loading, error } = useSelector(state => state.articles);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'DRAFT',
  });
  const [errors, setErrors] = useState({});

  // REMOVED: Don't fetch article here, EditArticle already does it
  useEffect(() => {
    if (isEdit && currentArticle) {
      console.log('ArticleForm: Setting form data from currentArticle');
      setFormData({
        title: currentArticle.title || '',
        content: currentArticle.content || '',
        status: currentArticle.status || 'DRAFT',
      });
    }
  }, [isEdit, currentArticle]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit && currentArticle) {
        await dispatch(updateArticle({ 
          id: currentArticle.id, 
          updates: formData 
        })).unwrap();
        toast.success('Article updated successfully!');
      } else {
        await dispatch(createArticle(formData)).unwrap();
        toast.success('Article created successfully!');
      }
      
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the effect above
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // REMOVED: Don't show loading here, let EditArticle handle it
  // if (isEdit && loading) {
  //   return (
  //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Loading article...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // If editing but no currentArticle yet, show nothing (EditArticle shows loading)
  if (isEdit && !currentArticle) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            placeholder="Enter article title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => handleChange('content', value)}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;