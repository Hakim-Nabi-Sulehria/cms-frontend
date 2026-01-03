// src/components/layout/Navbar.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../../store/authSlice'
import { FaUser, FaSignOutAlt, FaNewspaper, FaPlus } from 'react-icons/fa'
import { ROLES, PERMISSIONS } from '../../utils/constants'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <FaNewspaper className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Ultimate Articles</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {PERMISSIONS.CREATE_ARTICLE.includes(user.role) && (
              <Link
                to="/articles/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <FaPlus className="mr-2" />
                New Article
              </Link>
            )}

            <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100">
              <FaUser className="text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar