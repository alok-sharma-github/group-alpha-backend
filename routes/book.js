const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book");

// Create a new book
router.post("/", bookController.createBook);

// Get all books
router.get("/", bookController.getBooks); // Fetch all books

// Get a book by ID
router.get("/:id", bookController.getBookById); // Fetch book details by ID

// Get books by title
router.get("/search/:title", bookController.getBooksByTitle); // Add this line

// Update a book
router.put("/:id", bookController.updateBook); // Update book details

// Delete a book
router.delete("/:id", bookController.deleteBook); // Delete a book

module.exports = router;
