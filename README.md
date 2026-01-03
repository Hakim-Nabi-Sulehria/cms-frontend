Features
🔐 Authentication & Authorization
JWT-based authentication with secure token management

Role-Based Access Control (RBAC) with three roles:

Admin: Full system access

Editor: Create and edit own articles

Viewer: Read-only access

Protected routes with middleware

Secure password handling

📝 Content Management
Rich Text Editor: WYSIWYG editor with React Quill

Article Management: Create, edit, delete articles

Article Status: Draft/Published states

Article Ownership: Author-based permissions

Pagination: Efficient article listing

Search & Filter: Advanced filtering capabilities

🎨 User Interface
Responsive Design: Mobile-first approach

Modern UI: Built with Tailwind CSS

Loading States: Skeleton loaders and spinners

Toast Notifications: User feedback with react-hot-toast

Accessible: ARIA labels and keyboard navigation

🔧 Technical Features
State Management: Redux Toolkit with async thunks

Routing: React Router DOM v6

Form Validation: Real-time validation

Error Handling: Centralized error management

API Integration: Axios with interceptors

Environment Configuration: Multi-environment support

📋 Prerequisites
Node.js 18.0.0 or higher

npm 9.0.0 or higher

 Quick Start
1. Clone the Repository
bash
git clone https://github.com/Hakim-Nabi-Sulehria/cms-frontend.git
cd cms-frontend
2. Install Dependencies
bash
npm install
3. Environment Configuration
Create a .env file in the root directory:

env
VITE_API_URL=http://localhost:5000/api
For production, use:

env
VITE_API_URL=https://your-backend-url.com/api
4. Run Development Server
bash
npm run dev
Open http://localhost:5173 in your browser.

5. Build for Production
bash
npm run build
The built files will be in the dist directory.

6. Preview Production Build
bash
npm run preview

User Roles & Permissions
Admin (admin@example.com / password123)
✅ Create articles

✅ Edit all articles

✅ Delete any article

✅ View all articles

✅ User management (if implemented)

Editor (editor@example.com / password123)
✅ Create articles

✅ Edit own articles

❌ Delete articles

✅ View all articles

Viewer (viewer@example.com / password123)
❌ Create articles

❌ Edit articles

❌ Delete articles

✅ View published articles

🔧 Available Scripts
npm run dev - Start development server

npm run build - Build for production

npm run preview - Preview production build

npm run lint - Run ESLint

npm run format - Format code with Prettier

🌐 API Integration
Base Configuration
The application expects a backend API with the following endpoints:

javascript
// Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
POST   /api/auth/logout

// Articles
GET    /api/articles
GET    /api/articles/public
GET    /api/articles/:id
POST   /api/articles
PUT    /api/articles/:id
DELETE /api/articles/:id
GET    /api/articles/my-articles
Environment Variables
Variable	Description	Default
VITE_API_URL	Backend API URL	http://localhost:5000/api

Custom Components
Buttons: Primary, Secondary, Danger variants

Cards: Article cards with hover effects

Forms: Validated form inputs with error states

Modals: Modal dialogs for confirmations

Loaders: Animated spinners and skeleton loaders

📱 Responsive Design
The application is fully responsive with breakpoints:

Mobile: < 640px

Tablet: 640px - 1024px

Desktop: > 1024px

🔒 Security Features
JWT Storage: Tokens stored in HTTP-only cookies (configurable)

Route Protection: Private routes with role-based access

Input Validation: Client-side form validation

XSS Protection: Sanitized HTML content rendering

CORS Configured: Secure cross-origin requests

