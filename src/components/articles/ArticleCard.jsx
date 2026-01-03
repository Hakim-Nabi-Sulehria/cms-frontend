// src/components/articles/ArticleCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa'
import { canEditArticle, canDeleteArticle, ARTICLE_STATUS } from '../../utils/constants'

const ArticleCard = ({ article, onDelete }) => {
  const { user } = useSelector(state => state.auth)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {article.title}
          </h3>
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <FaUser className="mr-1" />
              {article.authorName}
            </span>
            <span>
              {format(new Date(article.createdAt), 'MMM dd, yyyy')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.status === ARTICLE_STATUS.PUBLISHED
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
              }`}>
              {article.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {canEditArticle(article, user) && (
            <Link
              to={`/articles/${article.id}/edit`}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full"
              title="Edit"
            >
              <FaEdit />
            </Link>
          )}

          {canDeleteArticle(user) && (
            <button
              onClick={() => onDelete(article.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              title="Delete"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      <div
        className="text-gray-700 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          to={`/articles/${article.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  )
}

export default ArticleCard