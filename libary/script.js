document.addEventListener("DOMContentLoaded", function () {
    const bookContainer = document.getElementById("bookContainer");
    const searchInput = document.getElementById("searchInput");
    const genreFilter = document.getElementById("genreFilter");
    let books = [];
  
    // Load XML
    fetch("books.xml")
      .then(res => res.text())
      .then(xmlText => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");
        const bookNodes = xml.getElementsByTagName("book");
  
        for (let book of bookNodes) {
          books.push({
            title: book.getElementsByTagName("title")[0].textContent,
            author: book.getElementsByTagName("author")[0].textContent,
            genre: book.getElementsByTagName("genre")[0].textContent,
            year: book.getElementsByTagName("year")[0].textContent,
            description: book.getElementsByTagName("description")[0].textContent,
            cover: book.getElementsByTagName("cover")[0].textContent,
          });
        }
  
        renderBooks(books);
      });
  
    // Render
    function renderBooks(data) {
      bookContainer.innerHTML = "";
      data.forEach(book => {
        const div = document.createElement("div");
        div.className = "book";
        div.innerHTML = ` 
        <img src="${book.cover}" alt="Cover of ${book.title}" class="cover"></img>
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Genre:</strong> ${book.genre}</p>
          <p><strong>Year:</strong> ${book.year}</p>
          <p>${book.description}</p>
        `;
        bookContainer.appendChild(div);
      });
    }
  
    // Search & Filter
    function filterBooks() {
      const query = searchInput.value.toLowerCase();
      const genre = genreFilter.value;
      const filtered = books.filter(book => {
        const matchTitle = book.title.toLowerCase().includes(query);
        const matchAuthor = book.author.toLowerCase().includes(query);
        const matchGenre = genre === "all" || book.genre === genre;
        return (matchTitle || matchAuthor) && matchGenre;
      });
      renderBooks(filtered);
    }
  
    searchInput.addEventListener("input", filterBooks);
    genreFilter.addEventListener("change", filterBooks);
  });
  