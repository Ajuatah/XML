// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { pool } from './db/db.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path'; //  Import path module
import { fileURLToPath } from 'url'; //  For __dirname in ES modules


const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Derive __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Current working directory (process.cwd()):', process.cwd());
console.log('__dirname (from server.js):', __dirname);
const pagesDirPath = path.join(__dirname, 'pages');
const registerHtmlPath = path.join(pagesDirPath, 'register.html');
console.log('Calculated path for static files (pages):', pagesDirPath);
console.log('Calculated path for register.html:', registerHtmlPath);
// ----------------------------------------

async function testDbConnection() {
  try {
    // Attempt to acquire a client from the pool
    const client = await pool.connect();
    // Release the client back to the pool immediately
    client.release();
    console.log('Database connected successfully!');
  } catch (err) {
    console.error('Database connection FAILED:', err.message);
    console.error('Please check your .env file DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME settings.');
    console.error('Also ensure your PostgreSQL server is running and accessible.');
    // Optionally, exit the process if DB connection is critical for startup
    // process.exit(1);
  }
}

// --- Middleware (Order matters!) ---
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// --- Serve static files (HTML, CSS, JS, images). Place this early! ---
// Serve files from the 'pages' directory directly
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(pagesDirPath));

// Serve an 'images' folder if you plan to put your book covers there.
// Create a 'public/images' folder in your root if you use this.
// Example: Libary/public/images/alchemist.jpg
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// --- Route for the root URL '/' ---
// When someone visits http://localhost:3000/, serve register.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'register.html'));
});


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; 
    next();
  });
};

// Example: Protected route
//app.get('/api/protected', authenticateToken, (req, res) => {
 // res.json({ message: `Hello ${req.user.username}, you're authorized.` });
//});
app.get('/books', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'books.html'));
});


// --- API Routes ---

// User Authentication
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    if (err.code === '23505') { // PostgreSQL unique violation error code
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      console.error('Error during registration:', err); // Log the actual error for debugging
      res.status(500).json({ error: 'Error registering user' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '2h' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error('Error during login:', err); // Log the actual error
    res.status(500).json({ error: 'Error during login' });
  }
});

// 1. Get Page Content by Name (e.g., for XML data)
app.get('/api/pages/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const result = await pool.query('SELECT content FROM pages WHERE name = $1', [name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Page content not found in DB' });
    }
    res.setHeader('Content-Type', 'application/xml');
    res.send(result.rows[0].content);
  } catch (err) {
    console.error('Error fetching page content:', err);
    res.status(500).json({ error: 'Error fetching page content' });
  }
});

// 2. Get All Books
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// 3. Search Books by Title or Author
app.get('/api/books/search', async (req, res) => {
  const { query } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM books WHERE
       LOWER(title) LIKE LOWER($1) OR
       LOWER(author) LIKE LOWER($1)`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching books:', err);
    res.status(500).json({ error: 'Error searching books' });
  }
});

// 4. Filter Books by Genre
app.get('/api/books/genre/:genre', async (req, res) => {
  const { genre } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM books WHERE LOWER(genre) = LOWER($1)`,
      [genre]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error filtering books by genre:', err);
    res.status(500).json({ error: 'Error filtering books by genre' });
  }
});

// 5. Handle Contact Form Submission (New Route!)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
   
    await pool.query(
      `INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)`,
      [name, email, message]
    );
    console.log('Contact message saved:', { name, email, message });
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});