
// TESTING
const myLibrary = new Library("My Library");

// Add some books to the library
myLibrary.addBook("The Hobbit", "J.R.R. Tolkien", "9780547928227");
myLibrary.addBook("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "9780590353427");
myLibrary.addBook("To Kill a Mockingbird", "Harper Lee", "9780061120084");

// Display all available books
myLibrary.displayAvailableBooks();

// Search for books by title or author
myLibrary.searchBook("harry potter");

// Remove a book from the library
myLibrary.removeBook("9780590353427");

// Display available books after removal
myLibrary.displayAvailableBooks();



//BOOK OBJECT
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.available = true;
  }

  // Getter for availability
  isAvailable() {
    return this.available;
  }

  // Setter for availability
  setAvailability(status) {
    this.available = status;
  }

  // Method to display book information
  displayInfo() {
    console.log(`${this.title} by ${this.author} (ISBN: ${this.isbn})`);
  }
}


//LIBRARY OBJECT
class Library {
  constructor(name) {
    this.name = name;
    this.books = [];
  }

  // Method to add a new book
  addBook(title, author, isbn) {
    const newBook = new Book(title, author, isbn);
    this.books.push(newBook);
    console.log(`${newBook.title} by ${newBook.author} has been added to ${this.name}.`);
  }

  // Method to remove a book
  removeBook(isbn) {
    this.books = this.books.filter(book => book.isbn !== isbn);
    console.log(`Book with ISBN ${isbn} has been removed from ${this.name}.`);
  }

  // Method to display all available books
  displayAvailableBooks() {
    console.log(`Available books in ${this.name}:`);
    this.books.forEach(book => {
      if (book.isAvailable()) {
        book.displayInfo();
      }
    });
  }

  // Method to search for a book by title or author
  searchBook(query) {
    const results = this.books.filter(book => {
      return book.title.toLowerCase().includes(query.toLowerCase()) ||
             book.author.toLowerCase().includes(query.toLowerCase());
    });

    if (results.length === 0) {
      console.log(`No books found matching "${query}".`);
    } else {
      console.log(`Search results for "${query}":`);
      results.forEach(book => book.displayInfo());
    }
  }
}

