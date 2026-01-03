// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ArticlesPage from './pages/ArticlesPage'
import CreateArticle from './pages/CreateArticle'
import EditArticle from './pages/EditArticle'
import PublicArticles from './pages/PublicArticles'
import PrivateRoute from './components/auth/PrivateRoute'
import { PERMISSIONS } from './utils/constants'
import ArticleDetail from './pages/ArticleDetail'

function App() {
  const { isAuthenticated } = useSelector(state => state.auth)

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
      } />

      <Route path="/" element={<PublicArticles />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/articles" element={
        <PrivateRoute requiredRoles={PERMISSIONS.VIEW_ARTICLES}>
          <ArticlesPage />
        </PrivateRoute>
      } />

      <Route path="/articles/:id" element={
        <PrivateRoute requiredRoles={PERMISSIONS.VIEW_ARTICLES}>
          <ArticleDetail />
        </PrivateRoute>
      } />


      <Route path="/articles/new" element={
        <PrivateRoute requiredRoles={PERMISSIONS.CREATE_ARTICLE}>
          <CreateArticle />
        </PrivateRoute>
      } />

      <Route path="/articles/:id/edit" element={
        <PrivateRoute>
          <EditArticle />
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App