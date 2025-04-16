# Interactive Book Library
 **Interactive Book Library** is a web-based application that allows users to browse a collection of books, search by title or author, and filter by genre. The application uses XML to store book data and dynamically renders the content on the webpage.

## Features

- Display a collection of books with details such as title, author, genre, year, description, and cover image.
- Search functionality to find books by title or author.
- Filter books by genre.
- Responsive design for a seamless user experience.

## Project Structure
Library/ 
    ├── books.xml # XML file containing book data 
    ├── index.html # Main HTML file for the application 
    ├── script.js # JavaScript file for dynamic functionality 
    ├── style.css # CSS file for styling the application


    
## How It Works

1. **Data Source**: The `books.xml` file contains the book data in XML format.
2. **Dynamic Rendering**: The `script.js` file fetches the XML data, parses it, and dynamically renders the book details on the webpage.
3. **Search and Filter**: Users can search for books by title or author and filter them by genre using the input fields on the webpage.

## Getting Started

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).
- A local or remote server to serve the files (e.g., [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for Visual Studio Code).

### Running the Project

1. Clone or download the project files.
2. Open the `index.html` file in a web browser or serve the project using a local server.
3. Interact with the application by searching for books or filtering by genre.

## File Descriptions

- **`books.xml`**: Contains the book data in XML format, including details like title, author, genre, year, description, and cover image URL.
- **`index.html`**: The main HTML file that structures the webpage.
- **`script.js`**: Handles fetching and parsing the XML data, rendering the books, and implementing search and filter functionality.
- **`style.css`**: Provides styling for the webpage, ensuring a clean and responsive design.

## Example Book Data

Here is an example of a book entry in the `books.xml` file:

```xml
<book>
  <title>The Hobbit</title>
  <author>J.R.R. Tolkien</author>
  <genre>Fantasy</genre>
  <year>1937</year>
  <cover>https://covers.openlibrary.org/b/id/6979861-L.jpg</cover>
  <description>A fantasy novel about the journey of Bilbo Baggins.</description>
</book>