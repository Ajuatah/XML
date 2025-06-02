// loaders/xmlLoader.js
import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { pool } from '../db/db.js';
import { fileURLToPath } from 'url'; // <--- ADDED: For __dirname in ES modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // This __dirname will be 'Libary/loaders'

const parser = new XMLParser();

const loadPageXML = async (fileName, pageName) => {
  // Path needs to be relative to the project root, not to xmlLoader.js
  // Adjust: from Libary/loaders/xmlLoader.js to Libary/xml/fileName
  const xmlPath = path.join(__dirname, '..', 'xml', fileName); // 
  try {
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');

    await pool.query(
      `INSERT INTO pages (name, content)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET content = EXCLUDED.content`,
      [pageName, xmlContent]
    );
    console.log(`Loaded page: ${pageName}`);
  } catch (err) {
    console.error(`Error loading ${fileName} for page ${pageName}:`, err.message);
    throw err; // Re-throw to be caught by main()
  }
};

const loadBookCatalog = async () => {
  const catalogPath = path.join(__dirname, '..', 'xml', 'book catalog.xml'); // <--- FIXED PATH
  try {
    const xmlContent = fs.readFileSync(catalogPath, 'utf8');
    const parsed = parser.parse(xmlContent);

    // Ensure 'books.book' exists and is an array
    const books = parsed.books?.book || [];
    if (!Array.isArray(books)) { // Handle case where there's only one book
      books = [books];
    }

    for (const book of books) {
      const { title, author, genre, year, description, cover } = book;

      // Note: 'cover' from XML will be inserted into the 'cover' column.
      // Your books.html expects 'book.cover_image', so ensure consistency.
      // I've adjusted books.html to use 'book.cover'.
     await pool.query(
  `INSERT INTO books (id, title, author, genre, description, cover_image)
   VALUES ($1, $2, $3, $4, $5, $6)
   ON CONFLICT (id) DO UPDATE SET
     title = EXCLUDED.title,
     author = EXCLUDED.author,
     genre = EXCLUDED.genre,
     description = EXCLUDED.description,
     cover_image = EXCLUDED.cover_image`, // Make sure this line is correct
  [book.id, book.title, book.author, book.genre, book.description, book.cover_image]
);
    }
    console.log(`Loaded ${books.length} books into the catalog`);
  } catch (err) {
    console.error(`Error loading book_catalog.xml:`, err.message);
    throw err; // Re-throw to be caught by main()
  }
};

const main = async () => {
  try {
    console.log('--- Starting XML content loading script ---');
    console.log('Attempting to connect to the database...');
    // Attempt to acquire a client from the pool to test connection
    const client = await pool.connect();
    client.release(); // Release the client back immediately
    console.log('Database connection successful from xmlLoader.js');

    await loadPageXML('register.xml', 'register');
    await loadPageXML('books.xml', 'books');
    await loadPageXML('contact.xml', 'contact');
    await loadBookCatalog();
    console.log('All XML content loaded successfully into the database!');
  } catch (err) {
    console.error('CRITICAL ERROR: Failed to load XML content or connect to DB:', err);
    console.error('Please check your .env file DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME settings.');
    console.error('Also ensure your PostgreSQL server is running and accessible.');
  } finally {
    process.exit(0);
  }
};

main();
// --- REMOVED: main() call here ---
// This script should be run manually, not automatically on server start.
// Instead, add a script to package.json: "load-data": "node loaders/xmlLoader.js"
// Then run: npm run load-data