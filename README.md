# Blog Platform

A full-stack blog platform with separate interfaces for content authors and readers, built with React and Node.js.

## Project Structure

The project consists of three main components:
- `author-frontend`: Content management interface for blog authors
- `viewer-frontend`: Public-facing blog interface for readers
- `Blog_API_Backend`: REST API backend service

## Features

- **Author Platform**
  - Secure authentication system
  - Blog post creation and management
  - Rich text editing capabilities
  - Protected routes for authorized access

- **Viewer Platform**
  - Public blog browsing
  - Comment system
  - User registration and authentication
  - Responsive blog grid layout

- **Backend API**
  - RESTful API architecture
  - Prisma ORM with SQL database
  - JWT authentication
  - Comment management
  - Input validation
  - Comprehensive test coverage

## Technology Stack

- **Frontend**
  - React
  - Vite
  - CSS Modules
  - Context API for state management

- **Backend**
  - Node.js
  - Express
  - Prisma ORM
  - Jest for testing
  - Passport.js for authentication

## Installation

1. Clone the repository
```bash
git clone [repository-url]
cd Blog
```

2. Install dependencies for each component:
```bash
# Backend
cd Blog_API_Backend
npm install

# Author Frontend
cd ../author-frontend
npm install

# Viewer Frontend
cd ../viewer-frontend
npm install
```

3. Set up the database:
```bash
cd Blog_API_Backend
npx prisma migrate dev
```

## Development

Start each component in development mode:

```bash
# Backend
cd Blog_API_Backend
npm run dev

# Author Frontend
cd author-frontend
npm run dev

# Viewer Frontend
cd viewer-frontend
npm run dev
```

## Testing

```bash
cd Blog_API_Backend
npm test
```

## Environment Variables

Create `.env` files in each project directory:

### Backend
```
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
```

### Frontend (both author and viewer)
```
VITE_API_URL="http://localhost:3000/api/v1"
```