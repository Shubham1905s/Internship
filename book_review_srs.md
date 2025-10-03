# Software Requirements Specification (SRS)
## Book Review Platform

**Document Version:** 1.0  
**Date:** October 3, 2025  
**Project Deadline:** October 5, 2025  
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features and Requirements](#3-system-features-and-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Database Design](#6-database-design)
7. [API Specifications](#7-api-specifications)
8. [Security Requirements](#8-security-requirements)
9. [Deployment Requirements](#9-deployment-requirements)
10. [Appendices](#10-appendices)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for the Book Review Platform, a full-stack web application that enables users to discover books, write reviews, and manage their book collections.

### 1.2 Scope
The Book Review Platform is a MERN stack application that provides:
- User authentication and authorization system
- Book management with CRUD operations
- Review and rating system
- Responsive frontend interface
- RESTful API backend
- Secure data storage with MongoDB

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| MERN | MongoDB, Express.js, React.js, Node.js |
| JWT | JSON Web Token |
| CRUD | Create, Read, Update, Delete |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| MVC | Model-View-Controller |
| UI/UX | User Interface/User Experience |
| SPA | Single Page Application |

### 1.4 References
- MongoDB Documentation: https://docs.mongodb.com/
- Express.js Documentation: https://expressjs.com/
- React Documentation: https://react.dev/
- JWT Standard: RFC 7519

---

## 2. Overall Description

### 2.1 Product Perspective
The Book Review Platform is a standalone web application consisting of:
- **Backend Server**: Node.js + Express.js REST API
- **Database**: MongoDB Atlas cloud database
- **Frontend**: React.js single-page application
- **Authentication**: JWT-based token authentication

### 2.2 Product Functions
The system provides the following high-level functions:

1. **User Management**
   - User registration and authentication
   - Profile management
   - Session management via JWT

2. **Book Management**
   - Create, read, update, delete books
   - Pagination and listing
   - Ownership-based access control

3. **Review Management**
   - Add, edit, delete reviews
   - Star rating system (1-5)
   - Average rating calculation

4. **Search and Discovery** (Bonus)
   - Search by title/author
   - Filter by genre
   - Sort by various criteria

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Expertise |
|------------|-------------|---------------------|
| Guest User | Can view books and reviews only | Low |
| Registered User | Can add books and write reviews | Low to Medium |
| Book Creator | User who created specific book entries | Low to Medium |

### 2.4 Operating Environment
- **Client-side**: Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Server-side**: Node.js runtime environment (v16+)
- **Database**: MongoDB Atlas (cloud-hosted)
- **Deployment**: 
  - Backend: Render/Heroku/AWS
  - Frontend: Vercel/Netlify

### 2.5 Design and Implementation Constraints
- Must use MERN stack exclusively
- JWT for authentication (no session-based auth)
- MongoDB for data persistence
- RESTful API design principles
- Responsive design for mobile and desktop
- Password hashing with bcrypt

### 2.6 Assumptions and Dependencies
- Users have internet connectivity
- MongoDB Atlas account is available
- Node.js and npm are installed on development machines
- Modern browsers with JavaScript enabled
- CORS configured for frontend-backend communication

---

## 3. System Features and Requirements

### 3.1 User Authentication System

#### 3.1.1 Description
Secure user registration and login system with JWT token-based authentication.

#### 3.1.2 Functional Requirements

**FR-1.1: User Registration**
- **Priority:** High
- **Description:** Users must be able to create new accounts
- **Input:** Name (string), Email (string, unique), Password (string, min 6 chars)
- **Processing:**
  - Validate email format and uniqueness
  - Hash password using bcrypt (salt rounds: 10)
  - Store user in database
- **Output:** Success message or validation errors
- **Validation Rules:**
  - Email must be valid format
  - Email must be unique in database
  - Password minimum 6 characters
  - Name is required

**FR-1.2: User Login**
- **Priority:** High
- **Description:** Users must be able to authenticate and receive JWT token
- **Input:** Email (string), Password (string)
- **Processing:**
  - Verify email exists in database
  - Compare hashed password using bcrypt
  - Generate JWT token with 24-hour expiration
  - Token payload: { userId, email }
- **Output:** JWT token and user information (excluding password)
- **Error Cases:**
  - Invalid email
  - Incorrect password
  - Account not found

**FR-1.3: Authentication Middleware**
- **Priority:** High
- **Description:** Protect routes requiring authentication
- **Processing:**
  - Extract token from Authorization header (Bearer token)
  - Verify token signature and expiration
  - Attach user information to request object
- **Output:** Allow or deny request based on token validity

---

### 3.2 Book Management System

#### 3.2.1 Description
Complete CRUD operations for book management with ownership-based permissions.

#### 3.2.2 Functional Requirements

**FR-2.1: Add Book**
- **Priority:** High
- **Description:** Authenticated users can add new books
- **Input:** 
  - Title (string, required)
  - Author (string, required)
  - Description (string, required)
  - Genre (string, required)
  - Published Year (number, required, 1000-2025)
- **Processing:**
  - Validate all required fields
  - Associate book with logged-in user (addedBy)
  - Store in database with timestamp
- **Output:** Created book object with generated ID
- **Authorization:** Must be authenticated

**FR-2.2: View All Books**
- **Priority:** High
- **Description:** Display paginated list of all books
- **Input:** 
  - Page number (default: 1)
  - Limit (default: 5 books per page)
- **Processing:**
  - Fetch books with pagination
  - Include addedBy user information (populate)
  - Calculate total pages
- **Output:** 
  - Array of books
  - Total count
  - Current page
  - Total pages
- **Authorization:** Public (no authentication required)

**FR-2.3: View Single Book Details**
- **Priority:** High
- **Description:** Display detailed information about a specific book
- **Input:** Book ID (MongoDB ObjectId)
- **Processing:**
  - Fetch book by ID
  - Populate addedBy user details
  - Fetch all associated reviews
  - Calculate average rating
- **Output:** 
  - Complete book information
  - Array of reviews
  - Average rating (1-5, rounded to 1 decimal)
  - Total review count
- **Authorization:** Public

**FR-2.4: Edit Book**
- **Priority:** High
- **Description:** Book creators can update their books
- **Input:** 
  - Book ID
  - Updated fields (title, author, description, genre, year)
- **Processing:**
  - Verify user is book creator (addedBy === userId)
  - Validate updated fields
  - Update database record
- **Output:** Updated book object
- **Authorization:** Must be book creator
- **Error Cases:**
  - Unauthorized (not book creator)
  - Book not found
  - Invalid field values

**FR-2.5: Delete Book**
- **Priority:** High
- **Description:** Book creators can delete their books
- **Input:** Book ID
- **Processing:**
  - Verify user is book creator
  - Delete associated reviews (cascade delete)
  - Delete book from database
- **Output:** Success confirmation message
- **Authorization:** Must be book creator
- **Error Cases:**
  - Unauthorized (not book creator)
  - Book not found

---

### 3.3 Review System

#### 3.3.1 Description
Users can rate and review books, edit/delete their reviews, and view aggregate ratings.

#### 3.3.2 Functional Requirements

**FR-3.1: Add Review**
- **Priority:** High
- **Description:** Authenticated users can review books
- **Input:**
  - Book ID (reference)
  - Rating (number, 1-5, required)
  - Review Text (string, min 10 chars, required)
- **Processing:**
  - Check user hasn't already reviewed this book
  - Validate rating range (1-5)
  - Store review with userId and bookId references
  - Update book's average rating
- **Output:** Created review object
- **Authorization:** Must be authenticated
- **Business Rules:**
  - One review per user per book
  - Cannot review own book

**FR-3.2: Edit Review**
- **Priority:** Medium
- **Description:** Users can edit their own reviews
- **Input:**
  - Review ID
  - Updated rating and/or review text
- **Processing:**
  - Verify user is review author
  - Validate new values
  - Update database record
  - Recalculate book's average rating
- **Output:** Updated review object
- **Authorization:** Must be review author

**FR-3.3: Delete Review**
- **Priority:** Medium
- **Description:** Users can delete their own reviews
- **Input:** Review ID
- **Processing:**
  - Verify user is review author
  - Remove review from database
  - Recalculate book's average rating
- **Output:** Success confirmation
- **Authorization:** Must be review author

**FR-3.4: View Book Reviews**
- **Priority:** High
- **Description:** Display all reviews for a specific book
- **Input:** Book ID
- **Processing:**
  - Fetch all reviews for book
  - Populate user information (name, not password)
  - Sort by creation date (newest first)
  - Calculate statistics (average rating, total reviews)
- **Output:**
  - Array of reviews with user details
  - Average rating
  - Total review count
- **Authorization:** Public

---

### 3.4 Bonus Features (Optional)

#### 3.4.1 Search and Filter System

**FR-4.1: Search Books**
- **Priority:** Low
- **Description:** Search books by title or author
- **Input:** Search query (string)
- **Processing:**
  - Case-insensitive regex search on title and author fields
  - Apply pagination to results
- **Output:** Filtered book list

**FR-4.2: Filter by Genre**
- **Priority:** Low
- **Description:** Filter books by genre
- **Input:** Genre name
- **Processing:** Query books matching exact genre
- **Output:** Filtered book list

**FR-4.3: Sort Books**
- **Priority:** Low
- **Description:** Sort books by different criteria
- **Input:** Sort field (year, rating) and order (asc, desc)
- **Processing:** Apply MongoDB sort operation
- **Output:** Sorted book list

#### 3.4.2 Advanced Features

**FR-4.4: Rating Distribution Chart**
- **Priority:** Low
- **Description:** Visual representation of rating distribution
- **Input:** Book ID
- **Processing:**
  - Count reviews for each rating (1-5 stars)
  - Calculate percentages
- **Output:** Data array for chart rendering (using Recharts)

**FR-4.5: User Profile Page**
- **Priority:** Low
- **Description:** Display user's books and reviews
- **Input:** User ID (from JWT)
- **Processing:**
  - Fetch all books added by user
  - Fetch all reviews written by user
- **Output:** User's activity summary

**FR-4.6: Dark/Light Mode**
- **Priority:** Low
- **Description:** Theme toggle functionality
- **Processing:** Store preference in localStorage
- **Output:** Dynamic theme switching

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Signup Page
**Components:**
- Name input field (text)
- Email input field (email)
- Password input field (password)
- Confirm Password input field (password)
- Submit button
- Link to Login page

**Validation:**
- Real-time validation feedback
- Error messages below fields
- Disable submit during API call
- Success redirect to login

#### 4.1.2 Login Page
**Components:**
- Email input field
- Password input field
- Submit button
- "Forgot Password?" link (optional)
- Link to Signup page

**Behavior:**
- Store JWT in localStorage on success
- Redirect to home page
- Show error messages for invalid credentials

#### 4.1.3 Book List Page (Home)
**Components:**
- Navigation bar with logo, search, login/logout
- Grid/list of book cards showing:
  - Book cover (placeholder if no image)
  - Title
  - Author
  - Genre
  - Average rating (stars)
  - Year published
- Pagination controls (Previous, Page numbers, Next)
- "Add Book" button (if authenticated)
- Filter/search sidebar (bonus)

**Interactions:**
- Click book card → Navigate to book details
- Pagination buttons → Load different page
- Add Book → Navigate to add book form

#### 4.1.4 Book Details Page
**Components:**
- Book information section:
  - Title (large heading)
  - Author
  - Description
  - Genre tag
  - Published year
  - Average rating with star display
  - Total reviews count
- Edit/Delete buttons (if user is creator)
- Reviews section:
  - List of all reviews with:
    - Reviewer name
    - Rating (stars)
    - Review text
    - Date posted
    - Edit/Delete buttons (if user's review)
- Add Review form (if authenticated):
  - Star rating selector (1-5)
  - Review text area
  - Submit button
- Rating distribution chart (bonus)

#### 4.1.5 Add/Edit Book Page
**Components:**
- Form with fields:
  - Title (text input)
  - Author (text input)
  - Description (textarea)
  - Genre (dropdown or text input)
  - Published Year (number input)
- Submit button
- Cancel button
- Form validation messages

**Validation:**
- All fields required
- Year between 1000-2025
- Real-time validation feedback

#### 4.1.6 Profile Page (Bonus)
**Components:**
- User information section
- Tabs for "My Books" and "My Reviews"
- Book cards for books added by user
- Review cards with book references
- Statistics (total books added, reviews written)

### 4.2 API Interfaces

#### 4.2.1 API Endpoint Structure

**Base URL:** `http://localhost:5000/api` (development)

**Response Format (Success):**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Response Format (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### 4.3 Hardware Interfaces
Not applicable - web-based application.

### 4.4 Software Interfaces

#### 4.4.1 Database Interface
- **Database System:** MongoDB Atlas
- **Driver:** Mongoose ODM
- **Connection:** Connection string with credentials
- **Collections:** users, books, reviews

#### 4.4.2 Third-Party Libraries

**Backend:**
- express: ^4.18.0 - Web framework
- mongoose: ^7.0.0 - MongoDB ODM
- bcryptjs: ^2.4.3 - Password hashing
- jsonwebtoken: ^9.0.0 - JWT generation/verification
- cors: ^2.8.5 - Cross-origin resource sharing
- dotenv: ^16.0.0 - Environment variables
- express-validator: ^7.0.0 - Input validation (optional)

**Frontend:**
- react: ^18.2.0 - UI library
- react-router-dom: ^6.10.0 - Routing
- axios: ^1.4.0 - HTTP client
- tailwindcss: ^3.3.0 or bootstrap: ^5.3.0 - CSS framework
- recharts: ^2.5.0 (bonus) - Charts library
- react-icons: ^4.8.0 - Icon library

### 4.5 Communications Interfaces

**HTTP Methods:**
- GET - Retrieve resources
- POST - Create resources
- PUT/PATCH - Update resources
- DELETE - Remove resources

**Authentication Header:**
```
Authorization: Bearer <jwt_token>
```

**Content-Type:**
- Request: application/json
- Response: application/json

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**NFR-1: Response Time**
- API responses should complete within 2 seconds under normal load
- Database queries should use proper indexing for optimization
- Pagination should load within 1 second

**NFR-2: Scalability**
- System should handle at least 100 concurrent users
- Database should support growth to 10,000+ books and 50,000+ reviews
- Implement efficient pagination to handle large datasets

**NFR-3: Resource Utilization**
- Backend should run efficiently on free-tier hosting (512MB RAM)
- Frontend bundle size should be optimized (code splitting recommended)

### 5.2 Safety Requirements

**NFR-4: Data Backup**
- MongoDB Atlas provides automated backups
- No manual backup system required for this project

**NFR-5: Error Recovery**
- Application should gracefully handle database connection failures
- Frontend should display user-friendly error messages
- API should return appropriate HTTP status codes

### 5.3 Security Requirements

**NFR-6: Authentication Security**
- Passwords must be hashed using bcrypt with minimum 10 salt rounds
- JWT tokens expire after 24 hours
- JWT secret must be stored in environment variables
- No sensitive data in JWT payload

**NFR-7: Authorization**
- Protected routes must verify valid JWT token
- Resource ownership must be verified for edit/delete operations
- SQL injection prevention through Mongoose ORM

**NFR-8: Data Validation**
- All user inputs must be validated on backend
- Sanitize inputs to prevent XSS attacks
- Use express-validator or joi for validation

**NFR-9: HTTPS**
- Production deployment must use HTTPS
- Secure cookie flags if using cookies (though JWT in localStorage is primary method)

### 5.4 Software Quality Attributes

**NFR-10: Maintainability**
- Code should follow MVC architecture pattern
- Proper folder structure: /models, /controllers, /routes, /middleware
- Use ESLint and Prettier for code consistency
- Comprehensive README documentation

**NFR-11: Usability**
- Responsive design for mobile (320px) to desktop (1920px)
- Intuitive navigation with clear call-to-action buttons
- Form validation with helpful error messages
- Loading states for asynchronous operations

**NFR-12: Reliability**
- Application should handle errors without crashing
- Database connection retry mechanism
- Proper error logging (console.error in development)

**NFR-13: Portability**
- Application should run on any system with Node.js installed
- Environment variables for configuration
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

---

## 6. Database Design

### 6.1 Entity-Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     User     │         │     Book     │         │    Review    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ _id (PK)     │◄───────┐│ _id (PK)     │◄───────┐│ _id (PK)     │
│ name         │        ││ title        │        ││ bookId (FK)  │
│ email (UQ)   │        ││ author       │        ││ userId (FK)  │
│ password     │        ││ description  │        ││ rating       │
│ createdAt    │        ││ genre        │        ││ reviewText   │
│ updatedAt    │        ││ year         │        ││ createdAt    │
└──────────────┘        ││ addedBy (FK) │        ││ updatedAt    │
                        ││ createdAt    │        │└──────────────┘
                        ││ updatedAt    │        │
                        │└──────────────┘        │
                        │                        │
                        └────────────────────────┘
            One-to-Many: User → Books
            One-to-Many: User → Reviews
            One-to-Many: Book → Reviews
```

### 6.2 Schema Definitions

#### 6.2.1 User Schema

```javascript
{
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Don't include password in queries by default
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `email`: unique index for fast lookup and uniqueness constraint

**Methods:**
- `comparePassword(candidatePassword)`: Compare plain text password with hashed password
- Pre-save hook: Hash password before saving if modified

#### 6.2.2 Book Schema

```javascript
{
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    minlength: [2, 'Author name must be at least 2 characters'],
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Year must be after 1000'],
    max: [2025, 'Year cannot be in the future']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `addedBy`: index for filtering books by user
- `genre`: index for filtering by genre
- `title, author`: text index for search functionality (bonus)

**Virtual Fields:**
- `reviews`: Virtual populate to get all reviews for a book

**Methods:**
- `calculateAverageRating()`: Recalculate average rating from all reviews

#### 6.2.3 Review Schema

```javascript
{
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `bookId`: index for fetching reviews by book
- `userId`: index for fetching reviews by user
- `{bookId, userId}`: compound unique index (one review per user per book)

**Post-save Hook:**
- Update book's average rating and review count after saving

**Post-remove Hook:**
- Update book's average rating and review count after deleting

### 6.3 Data Relationships

**Relationship Matrix:**

| From | To | Type | Cardinality |
|------|-----|------|-------------|
| User | Book | One-to-Many | 1:N |
| User | Review | One-to-Many | 1:N |
| Book | Review | One-to-Many | 1:N |
| Book | User (addedBy) | Many-to-One | N:1 |
| Review | User | Many-to-One | N:1 |
| Review | Book | Many-to-One | N:1 |

**Cascade Deletion Rules:**
- When a Book is deleted → All associated Reviews must be deleted
- When a User is deleted → Optionally delete or reassign their Books and Reviews (consider business logic)

---

## 7. API Specifications

### 7.1 Authentication Endpoints

#### 7.1.1 User Registration
```
POST /api/auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-10-03T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation errors (missing fields, invalid email, password too short)
- 409: Email already exists

#### 7.1.2 User Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
- 400: Missing email or password
- 401: Invalid credentials
- 404: User not found

---

### 7.2 Book Endpoints

#### 7.2.1 Get All Books (with Pagination)
```
GET /api/books?page=1&limit=5&genre=Fiction&search=harry
```

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 5): Items per page
- `genre` (optional, bonus): Filter by genre
- `search` (optional, bonus): Search in title/author
- `sort` (optional, bonus): Sort field (e.g., 'year', '-averageRating')

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": "J.K. Rowling",
        "description": "Harry Potter discovers he's a wizard...",
        "genre": "Fiction",
        "year": 1997,
        "averageRating": 4.8,
        "reviewCount": 150,
        "addedBy": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "John Doe"
        },
        "createdAt": "2025-10-01T10:00:00.000Z"
      }
      // ... more books
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 20,
      "totalBooks": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Error Responses:**
- 400: Invalid query parameters
- 500: Server error

#### 7.2.2 Get Single Book Details
```
GET /api/books/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "book": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "title": "Harry Potter and the Sorcerer's Stone",
      "author": "J.K. Rowling",
      "description": "Harry Potter discovers he's a wizard...",
      "genre": "Fiction",
      "year": 1997,
      "averageRating": 4.8,
      "reviewCount": 150,
      "addedBy": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2025-10-01T10:00:00.000Z"
    },
    "reviews": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
        "rating": 5,
        "reviewText": "Absolutely magical! A masterpiece...",
        "userId": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
          "name": "Jane Smith"
        },
        "createdAt": "2025-10-02T14:30:00.000Z"
      }
      // ... more reviews
    ]
  }
}
```

**Error Responses:**
- 404: Book not found
- 500: Server error

#### 7.2.3 Create New Book
```
POST /api/books
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel set in the Jazz Age...",
  "genre": "Classic Fiction",
  "year": 1925
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "book": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "description": "A classic American novel set in the Jazz Age...",
      "genre": "Classic Fiction",
      "year": 1925,
      "averageRating": 0,
      "reviewCount": 0,
      "addedBy": "64f1a2b3c4d5e6f7g8h9i0j1",
      "createdAt": "2025-10-03T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation errors (missing/invalid fields)
- 401: Unauthorized (no token or invalid token)
- 500: Server error

#### 7.2.4 Update Book
```
PUT /api/books/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "The Great Gatsby - Updated Edition",
  "description": "Updated description...",
  "year": 1925
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "book": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "title": "The Great Gatsby - Updated Edition",
      "author": "F. Scott Fitzgerald",
      "description": "Updated description...",
      "genre": "Classic Fiction",
      "year": 1925,
      "updatedAt": "2025-10-03T11:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation errors
- 401: Unauthorized
- 403: Forbidden (not the book creator)
- 404: Book not found
- 500: Server error

#### 7.2.5 Delete Book
```
DELETE /api/books/:id
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book and associated reviews deleted successfully"
}
```

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden (not the book creator)
- 404: Book not found
- 500: Server error

---

### 7.3 Review Endpoints

#### 7.3.1 Add Review to Book
```
POST /api/books/:bookId/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "reviewText": "This book changed my life! Highly recommend to everyone."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "review": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
      "bookId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "rating": 5,
      "reviewText": "This book changed my life! Highly recommend to everyone.",
      "createdAt": "2025-10-03T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation errors (invalid rating, review too short)
- 401: Unauthorized
- 404: Book not found
- 409: User already reviewed this book
- 500: Server error

#### 7.3.2 Get All Reviews for a Book
```
GET /api/books/:bookId/reviews
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
        "rating": 5,
        "reviewText": "This book changed my life! Highly recommend to everyone.",
        "userId": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "John Doe"
        },
        "createdAt": "2025-10-03T10:30:00.000Z"
      }
      // ... more reviews
    ],
    "stats": {
      "averageRating": 4.7,
      "totalReviews": 25,
      "ratingDistribution": {
        "5": 15,
        "4": 7,
        "3": 2,
        "2": 1,
        "1": 0
      }
    }
  }
}
```

**Error Responses:**
- 404: Book not found
- 500: Server error

#### 7.3.3 Update Review
```
PUT /api/reviews/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "reviewText": "Updated my review after re-reading. Still excellent!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "review": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
      "rating": 4,
      "reviewText": "Updated my review after re-reading. Still excellent!",
      "updatedAt": "2025-10-03T11:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation errors
- 401: Unauthorized
- 403: Forbidden (not the review author)
- 404: Review not found
- 500: Server error

#### 7.3.4 Delete Review
```
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden (not the review author)
- 404: Review not found
- 500: Server error

---

### 7.4 User Profile Endpoints (Bonus)

#### 7.4.1 Get User Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-09-15T10:00:00.000Z"
    },
    "stats": {
      "booksAdded": 5,
      "reviewsWritten": 12
    },
    "recentBooks": [
      // ... 5 most recent books added by user
    ],
    "recentReviews": [
      // ... 5 most recent reviews by user
    ]
  }
}
```

**Error Responses:**
- 401: Unauthorized
- 404: User not found
- 500: Server error

#### 7.4.2 Get User's Books
```
GET /api/users/my-books
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "books": [
      // ... all books added by authenticated user
    ],
    "total": 5
  }
}
```

#### 7.4.3 Get User's Reviews
```
GET /api/users/my-reviews
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
        "rating": 5,
        "reviewText": "Amazing book!",
        "bookId": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
          "title": "Harry Potter",
          "author": "J.K. Rowling"
        },
        "createdAt": "2025-10-03T10:30:00.000Z"
      }
      // ... more reviews
    ],
    "total": 12
  }
}
```

---

## 8. Security Requirements

### 8.1 Authentication Implementation

#### 8.1.1 Password Security
- **Hashing Algorithm:** bcrypt
- **Salt Rounds:** 10 (minimum)
- **Password Requirements:**
  - Minimum length: 6 characters
  - No maximum length (hashed)
  - Store only hashed passwords, never plain text

**Implementation Example:**
```javascript
// Before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

#### 8.1.2 JWT Token Security
- **Secret Key:** Stored in environment variable (JWT_SECRET)
- **Token Expiration:** 24 hours (86400 seconds)
- **Payload:** Minimal data (userId, email only)
- **Algorithm:** HS256 (HMAC with SHA-256)

**Token Generation:**
```javascript
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Token Verification Middleware:**
```javascript
// Middleware to protect routes
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};
```

### 8.2 Input Validation

#### 8.2.1 Backend Validation (Primary)
All inputs must be validated on the backend using:
- Mongoose schema validators
- express-validator (recommended)
- Custom validation functions

**Validation Rules:**
- **Email:** Valid format, unique in database
- **Password:** Min 6 characters for registration
- **Book Title:** 1-200 characters, required
- **Author Name:** 2-100 characters, required
- **Description:** 10-2000 characters, required
- **Genre:** Non-empty string, required
- **Year:** Integer between 1000-2025
- **Rating:** Integer between 1-5
- **Review Text:** 10-1000 characters, required

#### 8.2.2 Frontend Validation (Secondary)
Client-side validation for user experience:
- Real-time feedback on form inputs
- Disable submit button during validation
- Clear error messages
- Same rules as backend validation

### 8.3 Authorization Rules

#### 8.3.1 Resource Ownership Verification

**Book Operations:**
- **Create:** Any authenticated user
- **Read:** Public (no authentication)
- **Update:** Only book creator (addedBy === userId)
- **Delete:** Only book creator (addedBy === userId)

**Review Operations:**
- **Create:** Any authenticated user (except book creator)
- **Read:** Public (no authentication)
- **Update:** Only review author (userId === reviewAuthor)
- **Delete:** Only review author (userId === reviewAuthor)

**Implementation Pattern:**
```javascript
// Check if user owns the resource
const book = await Book.findById(bookId);
if (book.addedBy.toString() !== req.userId) {
  return res.status(403).json({
    success: false,
    error: 'You are not authorized to perform this action'
  });
}
```

### 8.4 Data Protection

#### 8.4.1 Sensitive Data Handling
- Never return password hashes in API responses
- Use `select: false` in password field schema
- Explicitly exclude password in queries: `.select('-password')`
- Don't log sensitive information (passwords, tokens)

#### 8.4.2 CORS Configuration
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

#### 8.4.3 Environment Variables
Required environment variables:
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Secret key for JWT signing (use strong random string)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS

**Example .env file:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreviews
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 8.5 Error Handling Security

#### 8.5.1 Error Response Structure
- **Development:** Detailed error messages and stack traces
- **Production:** Generic error messages, no sensitive data

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

#### 8.5.2 Rate Limiting (Bonus)
Implement rate limiting to prevent abuse:
- Use `express-rate-limit` package
- Limit: 100 requests per 15 minutes per IP
- Apply to authentication endpoints

---

## 9. Deployment Requirements

### 9.1 Backend Deployment

#### 9.1.1 Hosting Platform Options
- **Render** (Recommended for beginners)
  - Free tier available
  - Automatic deployments from GitHub
  - Environment variable support
  - HTTPS included
  
- **Heroku**
  - Free tier (with limitations)
  - Easy Git-based deployment
  - Extensive add-on ecosystem
  
- **Railway**
  - Modern platform with free tier
  - Simple deployment process
  
- **AWS (EC2/Elastic Beanstalk)**
  - More complex but scalable
  - Free tier for 12 months

#### 9.1.2 Deployment Checklist
- [ ] Set all environment variables in hosting platform
- [ ] Ensure `NODE_ENV=production`
- [ ] Configure CORS for production frontend URL
- [ ] Test database connection from deployed server
- [ ] Set up logging/monitoring
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (usually automatic)

#### 9.1.3 Build Commands
```bash
# For Render/Heroku
npm install
npm start

# Or if using build script
npm run build
```

**Required Files:**
- `package.json` with correct start script
- `.gitignore` (exclude node_modules, .env)
- `Procfile` (for Heroku): `web: node server.js`

### 9.2 Frontend Deployment

#### 9.2.1 Hosting Platform Options
- **Vercel** (Recommended)
  - Optimized for React
  - Automatic deployments
  - Free tier with custom domains
  - Built-in CDN
  
- **Netlify**
  - Similar to Vercel
  - Continuous deployment
  - Form handling capabilities
  
- **GitHub Pages**
  - Free hosting
  - Requires React Router configuration for SPA

#### 9.2.2 Build Configuration
**Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.render.com/api
```

**Build Commands:**
```bash
npm install
npm run build
```

**Output Directory:** `build/`

#### 9.2.3 React Router Configuration for Deployment
Create `_redirects` file (Netlify) or `vercel.json` (Vercel):

**For Netlify (_redirects):**
```
/*    /index.html   200
```

**For Vercel (vercel.json):**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### 9.3 Database Deployment

#### 9.3.1 MongoDB Atlas Setup
1. **Create Cluster:**
   - Sign up at mongodb.com/cloud/atlas
   - Create free M0 cluster
   - Choose cloud provider and region

2. **Database User:**
   - Create database user with password
   - Use strong password
   - Grant read/write permissions

3. **Network Access:**
   - Add IP whitelist: `0.0.0.0/0` (allow all) for development
   - For production: Add specific deployment server IPs

4. **Connection String:**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

5. **Database Name:**
   - Use descriptive name: `bookreviews` or `bookreviewplatform`

### 9.4 Post-Deployment Testing

#### 9.4.1 Testing Checklist
- [ ] Test user registration from deployed frontend
- [ ] Test user login and token storage
- [ ] Test CRUD operations for books
- [ ] Test review system functionality
- [ ] Verify protected routes work correctly
- [ ] Check pagination functionality
- [ ] Test on multiple devices/browsers
- [ ] Verify CORS is configured correctly
- [ ] Check for console errors
- [ ] Test error handling

#### 9.4.2 Monitoring
- Set up error tracking (optional: Sentry)
- Monitor server logs
- Check database connection status
- Monitor API response times

---

## 10. Appendices

### 10.1 Project Structure

#### 10.1.1 Backend Folder Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── bookController.js    # Book CRUD logic
│   └── reviewController.js  # Review CRUD logic
├── middleware/
│   ├── auth.js              # JWT verification middleware
│   ├── errorHandler.js      # Global error handler
│   └── validation.js        # Input validation middleware
├── models/
│   ├── User.js              # User schema
│   ├── Book.js              # Book schema
│   └── Review.js            # Review schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── bookRoutes.js        # Book endpoints
│   ├── reviewRoutes.js      # Review endpoints
│   └── userRoutes.js        # User profile endpoints (bonus)
├── utils/
│   ├── generateToken.js     # JWT generation utility
│   └── ApiError.js          # Custom error class
├── .env                     # Environment variables (not in git)
├── .env.example             # Example env file
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
├── server.js                # Entry point
└── README.md                # Backend documentation
```

#### 10.1.2 Frontend Folder Structure
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BookCard.jsx
│   │   ├── ReviewCard.jsx
│   │   ├── Pagination.jsx
│   │   ├── StarRating.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── SignupPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx          # Book list
│   │   ├── BookDetailsPage.jsx
│   │   ├── AddBookPage.jsx
│   │   ├── EditBookPage.jsx
│   │   └── ProfilePage.jsx        # Bonus
│   ├── context/
│   │   └── AuthContext.jsx        # Auth state management
│   ├── services/
│   │   ├── api.js                 # Axios configuration
│   │   ├── authService.js         # Auth API calls
│   │   ├── bookService.js         # Book API calls
│   │   └── reviewService.js       # Review API calls
│   ├── utils/
│   │   ├── localStorage.js        # Token management
│   │   └── validators.js          # Form validation
│   ├── App.jsx                    # Main component
│   ├── index.js                   # Entry point
│   └── index.css                  # Global styles
├── .env                           # Environment variables
├── .env.example                   # Example env file
├── .gitignore
├── package.json
├── tailwind.config.js             # If using Tailwind
└── README.md                      # Frontend documentation
```

### 10.2 Sample README.md Template

```markdown
# Book Review Platform

A full-stack MERN application for discovering, reviewing, and rating books.

## Features

- 🔐 User authentication with JWT
- 📚 Book management (CRUD operations)
- ⭐ Rating and review system
- 📄 Pagination for book listings
- 🔍 Search and filter (bonus)
- 📊 Rating statistics and charts (bonus)
- 🌓 Dark/Light mode (bonus)

## Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- Tailwind CSS / Bootstrap
- Context API

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

4. Start the server
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server
```bash
npm start
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Book Endpoints

#### Get All Books
```http
GET /api/books?page=1&limit=5
```

#### Get Single Book
```http
GET /api/books/:id
```

#### Create Book (Protected)
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description...",
  "genre": "Fiction",
  "year": 2020
}
```

#### Update Book (Protected)
```http
PUT /api/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Delete Book (Protected)
```http
DELETE /api/books/:id
Authorization: Bearer <token>
```

### Review Endpoints

#### Add Review (Protected)
```http
POST /api/books/:bookId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "reviewText": "Great book!"
}
```

#### Get Book Reviews
```http
GET /api/books/:bookId/reviews
```

#### Update Review (Protected)
```http
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "reviewText": "Updated review"
}
```

#### Delete Review (Protected)
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

## Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

## Live Demo

- **Frontend:** [your-frontend-url]
- **Backend API:** [your-backend-url]
- **Postman Collection:** [postman-collection-link]

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

MIT License

## Author

Your Name - [your-email@example.com]
```

### 10.3 Development Timeline

**Day 1 (October 3):**
- Set up project structure
- Implement database schemas
- Build authentication system
- Create basic Express server

**Day 2 (October 4):**
- Complete book CRUD API
- Implement review system API
- Build React components
- Implement frontend routing

**Day 3 (October 5 - Deadline Day):**
- Connect frontend to backend
- Implement pagination
- Add styling and responsive design
- Test all functionality
- Deploy application
- Complete documentation
- Submit project

**Time Allocation:**
- Backend: 40%
- Frontend: 40%
- Integration & Testing: 10%
- Deployment & Documentation: 10%

### 10.4 Testing Scenarios

#### 10.4.1 Authentication Testing
- Register with valid data
- Register with duplicate email (should fail)
- Register with invalid email format (should fail)
- Login with correct credentials
- Login with incorrect password (should fail)
- Access protected route without token (should fail)
- Access protected route with expired token (should fail)

#### 10.4.2 Book Management Testing
- Create book while authenticated
- Create book without authentication (should fail)
- View all books (pagination working)
- View single book details
- Edit own book
- Edit someone else's book (should fail)
- Delete own book
- Delete someone else's book (should fail)

#### 10.4.3 Review System Testing
- Add review to a book
- Add multiple reviews to same book by same user (should fail)
- Edit own review
- Edit someone else's review (should fail)
- Delete own review
- Delete someone else's review (should fail)
- Verify average rating calculation

### 10.5 Common Issues and Solutions

#### Issue 1: CORS Error
**Problem:** Frontend cannot connect to backend  
**Solution:** Configure CORS in Express server
```javascript
app.use(cors({ origin: 'http://localhost:3000' }));
```

#### Issue 2: JWT Token Not Persisting
**Problem:** User logged out on page refresh  
**Solution:** Store token in localStorage and restore on app load

#### Issue 3: MongoDB Connection Failed
**Problem:** Cannot connect to MongoDB Atlas  
**Solution:** 
- Check connection string format
- Verify IP whitelist (0.0.0.0/0 for development)
- Ensure database user has correct permissions

#### Issue 4: Protected Routes Not Working
**Problem:** Can access routes without authentication  
**Solution:** Apply auth middleware to protected routes
```javascript
router.post('/books', authenticate, bookController.createBook);
```

#### Issue 5: Password Not Hashing
**Problem:** Plain text passwords in database  
**Solution:** Implement pre-save hook in User model

### 10.6 Bonus Feature Ideas

1. **Email Verification:** Send verification email on signup
2. **Forgot Password:** Password reset functionality
3. **Book Categories:** Organize books into categories/genres
4. **User Avatars:** Profile picture upload
5. **Social Features:** Follow users, like reviews
6. **Reading Lists:** Create custom reading lists
7. **Advanced Search:** Full-text search with filters
8. **Recommendations:** Suggest books based on ratings
9. **Export Data:** Download reviews as PDF/CSV
10. **Admin Panel:** Manage users and content

### 10.7 Resources and References

**Documentation:**
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [JWT Introduction](https://jwt.io/introduction)

**Tutorials:**
- [MERN Stack Tutorial - freeCodeCamp](https://www.freecodecamp.org/news/mern-stack-tutorial/)
- [JWT Authentication - Web Dev Simplified](https://www.youtube.com/watch?v=mbsmsi7l3r4)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

**Tools:**
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Code editor

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | October 3, 2025 | Development Team | Initial SRS document creation |

---

**Document Status:** Final  
**Approval Status:** Approved for Implementation  
**Next Review Date:** October 5, 2025 (Post-Deadline Review)

---

*End of Software Requirements Specification Document*