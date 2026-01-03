// src/services/mockData.js
export const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 2,
    email: 'editor@example.com',
    name: 'Editor User',
    role: 'editor',
  },
  {
    id: 3,
    email: 'viewer@example.com',
    name: 'Viewer User',
    role: 'viewer',
  },
]

export const mockArticles = [
  {
    id: 1,
    title: 'Getting Started with React',
    content: '<p>React is a JavaScript library for building user interfaces...</p>',
    authorId: 1,
    authorName: 'Admin User',
    status: 'published',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'Advanced TypeScript Patterns',
    content: '<p>TypeScript provides advanced type patterns that can help...</p>',
    authorId: 2,
    authorName: 'Editor User',
    status: 'published',
    createdAt: '2023-10-02T11:00:00Z',
    updatedAt: '2023-10-02T11:00:00Z',
  },
  {
    id: 3,
    title: 'State Management with Redux',
    content: '<p>Redux is a predictable state container for JavaScript apps...</p>',
    authorId: 1,
    authorName: 'Admin User',
    status: 'draft',
    createdAt: '2023-10-03T12:00:00Z',
    updatedAt: '2023-10-03T12:00:00Z',
  },
  {
    id: 4,
    title: 'Authentication Best Practices',
    content: '<p>Implementing secure authentication is crucial for any application...</p>',
    authorId: 2,
    authorName: 'Editor User',
    status: 'published',
    createdAt: '2023-10-04T13:00:00Z',
    updatedAt: '2023-10-04T13:00:00Z',
  },
  {
    id: 5,
    title: 'Database Design Principles',
    content: '<p>Good database design is essential for application performance...</p>',
    authorId: 1,
    authorName: 'Admin User',
    status: 'published',
    createdAt: '2023-10-05T14:00:00Z',
    updatedAt: '2023-10-05T14:00:00Z',
  },
]

// Mock API responses
export const mockApi = {
  login: (email, password) => {
    const user = mockUsers.find(u => u.email === email)
    if (user && password === 'password123') {
      return Promise.resolve({
        user,
        token: 'mock-jwt-token-' + user.id,
      })
    }
    return Promise.reject(new Error('Invalid credentials'))
  },

  getArticles: (page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = mockArticles.slice(startIndex, endIndex)
    
    return Promise.resolve({
      articles: paginatedArticles,
      pagination: {
        page,
        limit,
        total: mockArticles.length,
        totalPages: Math.ceil(mockArticles.length / limit),
      },
    })
  },

  getArticle: (id) => {
    const article = mockArticles.find(a => a.id === parseInt(id))
    if (article) {
      return Promise.resolve(article)
    }
    return Promise.reject(new Error('Article not found'))
  },

  createArticle: (article, user) => {
    const newArticle = {
      id: mockArticles.length + 1,
      ...article,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockArticles.unshift(newArticle)
    return Promise.resolve(newArticle)
  },

  updateArticle: (id, updates, user) => {
    const index = mockArticles.findIndex(a => a.id === parseInt(id))
    if (index === -1) {
      return Promise.reject(new Error('Article not found'))
    }

    // Check permissions
    const article = mockArticles[index]
    if (user.role !== 'admin' && article.authorId !== user.id) {
      return Promise.reject(new Error('Not authorized to edit this article'))
    }

    const updatedArticle = {
      ...article,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    mockArticles[index] = updatedArticle
    return Promise.resolve(updatedArticle)
  },

  deleteArticle: (id, user) => {
    const index = mockArticles.findIndex(a => a.id === parseInt(id))
    if (index === -1) {
      return Promise.reject(new Error('Article not found'))
    }

    // Only admin can delete
    if (user.role !== 'admin') {
      return Promise.reject(new Error('Only admin can delete articles'))
    }

    mockArticles.splice(index, 1)
    return Promise.resolve(id)
  },
}