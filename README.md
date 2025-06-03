<<<<<<< HEAD

# Interactive Book Library
Name: FOUYOU CHINJEH BRAIN
MAT: SENG22SE009
**Interactive Book Library** is a web-based app for browsing, searching, and filtering books, with user authentication and a contact form. XML is used for data and page content.
## Technologies Used

*   XML (Extensible Markup Language)
*   XML Schema (XSD)
*   HTML (Hypertext Markup Language)
*   CSS (Cascading Style Sheets)
*   JavaScript and nodejs(express)
*   DOM (Document Object Model)
*   postgresql
## Features

- User registration and login (JWT authentication)
- Browse, search, and filter books
- Contact form to message the library
- XML-driven dynamic content
- Responsive design

## Project Structure

```
Libary/
  ├── pages/
  │     ├── books.html
  │     ├── contact.html
  │     └── register.html
  ├── xml/
  │     ├── books.xml
  │     ├── contact.xml
  │     └── register.xml
  ├── loaders/
  │     └── xmlLoader.js
  ├── db/
  │     └── db.js
  ├── server.js
  ├── package.json
  └── README.md
```

## How It Works

- XML files store book and page data.
- Node.js/Express backend serves HTML and APIs.
- Frontend fetches XML via API and renders content dynamically.
- Users can register, log in, browse books, and contact the library.

## SQL Script
-- Table to store XML pages
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    xml_content XML NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

  -- Users table for registration and login
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    year INT,
    cover_url TEXT,
    description TEXT
);

-- Contact messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Indexes for faster search
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);

======
## Getting Started

1. Install dependencies: `npm install`
2. Configure `.env` for your database.
3. Load XML data: `npm run load-data` to store xml to the database
4. Start server: `npm start`
5. Open `http://localhost:3000` in your browser.

>>>>>>> 654f145 (added new liabary project)
