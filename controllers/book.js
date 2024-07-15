const Book = require("../models/book"); // Change model import to Book

// Create a new book
const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const newBook = await book.save();
    res
      .status(201)
      .json({ message: "Book created successfully!", data: newBook });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ data: books });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ data: book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get books by title
const getBooksByTitle = async (req, res) => {
  try {
    const books = await Book.find({
      title: { $regex: req.params.title, $options: "i" },
    });
    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with that title" });
    }
    res.status(200).json({ data: books });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a book
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res
      .status(200)
      .json({ message: "Book updated successfully!", data: updatedBook });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  getBooksByTitle,
  updateBook, // Add this line
  deleteBook, // Add this line
};
