// src/pages/CreateArticle.jsx
import React from 'react'
import Layout from '../components/layout/Layout'
import ArticleForm from '../components/articles/ArticleForm'

const CreateArticle = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
          <p className="mt-2 text-gray-600">Write and publish your new article</p>
        </div>
        <ArticleForm />
      </div>
    </Layout>
  )
}

export default CreateArticle