<<<<<<< HEAD
# Book Catalog Project

This project demonstrates a simple book catalog application using XML, XML Schema, HTML, CSS, and JavaScript.

## Features

*   Displays a catalog of books fetched from an XML file (books.xml).
*   Uses an XML Schema (books.xsd) to define the structure of the XML data.
*   Employs JavaScript and the DOM API to dynamically render the book information on a web page.
*   Provides a basic example of working with XML in a web application context.

## Technologies Used

*   XML (Extensible Markup Language)
*   XML Schema (XSD)
*   HTML (Hypertext Markup Language)
*   CSS (Cascading Style Sheets)
*   JavaScript
*   DOM (Document Object Model)
*   Ajax (Asynchronous JavaScript and XML)

## Project Structure

*   books.xml: The XML document containing the book catalog data.
*   books.xsd: The XML Schema defining the structure of the XML data.
*   index.html: The HTML page that displays the book catalog.
*   style.css: (Optional) CSS file for styling the page.

## How to Run

1.  Clone the repository: 
2.  Open the index.html file in your web browser.

**Note:** Due to CORS (Cross-Origin Resource Sharing) policies, you might need to run a local web server to view this project correctly. You can use Python's http.server or a similar tool to serve the files.

## Code Explanation

*   **books.xml:** Contains the book data in XML format.
*   **books.xsd:** Defines the structure and data types for the XML document.
*   **index.html:**
    *   Includes JavaScript code that fetches the XML data using Ajax.
    *   Uses DOM methods to parse the XML and dynamically create HTML elements to display the book information.

## Future Enhancements

*   Add more books to the catalog.
*   Implement search and filtering functionality.
*   Use XSLT to transform the XML data into different formats.
*   Validate the XML document against the schema using JavaScript.
*   Implement error handling and loading indicators.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
=======
# Interactive Book Library

**Interactive Book Library** is a web-based app for browsing, searching, and filtering books, with user authentication and a contact form. XML is used for data and page content.

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

## Getting Started

1. Install dependencies: `npm install`
2. Configure `.env` for your database.
3. Load XML data: `npm run load-data`
4. Start server: `npm start`
5. Open `http://localhost:3000` in your browser.

## Example Book Data

```xml
<book>
  <title>The Hobbit</title>
  <author>J.R.R. Tolkien</author>
  <genre>Fantasy</genre>
  <year>1937</year>
  <cover>https://covers.openlibrary.org/b/id/6979861-L.jpg</cover>
  <description>A fantasy novel about the journey of Bilbo Baggins.</description>
</book>
```
>>>>>>> 654f145 (added new liabary project)
