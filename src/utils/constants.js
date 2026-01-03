// src/utils/constants.js
export const ROLES = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
};

export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

export const PERMISSIONS = {
  CREATE_ARTICLE: [ROLES.ADMIN, ROLES.EDITOR],
  EDIT_OWN_ARTICLE: [ROLES.ADMIN, ROLES.EDITOR],
  EDIT_ANY_ARTICLE: [ROLES.ADMIN],
  DELETE_ARTICLE: [ROLES.ADMIN],
  VIEW_ARTICLES: [ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER],
}

export const checkPermission = (userRole, requiredRoles) => {
  return requiredRoles.includes(userRole)
}

export const canEditArticle = (article, user) => {
  if (!user) return false
  if (user.role === ROLES.ADMIN) return true
  if (user.role === ROLES.EDITOR && article.authorId === user.id) return true
  return false
}

export const canDeleteArticle = (user) => {
  return user?.role === ROLES.ADMIN
}