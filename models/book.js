const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  image: { type: String },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String },
  availability: { type: Boolean, default: true },
  stock: { type: Number },
});

module.exports = mongoose.model("Book", bookSchema);
