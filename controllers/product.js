const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser"); // Add the csv-parser library

const upload = multer({ dest: "uploads/" });

// Controller for bulk upload of products
const bulkUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a CSV file." });
  }

  const results = [];
  const filePath = path.join(__dirname, "../", req.file.path);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        if (results.length === 0) {
          throw new Error("CSV file is empty");
        }

        // Get the user ID from the request object
        const createdBy = req.user.id;

        for (const product of results) {
          const { name, description, price, sellPrice, stock, category } =
            product;

          // Validate required fields
          if (
            !name ||
            !description ||
            !price ||
            !sellPrice ||
            !stock ||
            !category
          ) {
            throw new Error("Missing required product fields");
          }

          // Convert price and sellPrice to numbers
          product.price = parseFloat(product.price);
          product.sellPrice = parseFloat(product.sellPrice);
          product.stock = parseInt(product.stock);

          // Check for valid price and stock
          if (
            isNaN(product.price) ||
            isNaN(product.sellPrice) ||
            isNaN(product.stock)
          ) {
            throw new Error("Invalid price, sellPrice, or stock value");
          }

          // Optional: Check that price is not less than sellPrice
          if (product.price < product.sellPrice) {
            throw new Error("Price must be greater than or equal to sellPrice");
          }

          // Set the createdBy field
          product.createdBy = createdBy;
        }

        // Insert all products into the database
        await Product.insertMany(results);
        fs.unlinkSync(filePath); // Delete the uploaded file

        res
          .status(201)
          .json({ message: "Products uploaded successfully!", data: results });
      } catch (err) {
        fs.unlinkSync(filePath); // Delete the uploaded file in case of error
        res.status(400).json({ message: err.message });
      }
    });
};

// Controller for creating a product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, sellPrice, stock, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      sellPrice,
      stock,
      category,
      createdBy: req.user.id, // Ensure this field is set
    });

    const newProduct = await product.save();
    res
      .status(201)
      .json({ message: "Product created successfully!", data: newProduct });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller for getting all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ message: "Products fetched successfully!", data: products });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller for getting a product by ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product fetched successfully!", data: product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller for updating a product by ID
const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // Ensure that updates are validated
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product updated successfully!", data: product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller for deleting a product by ID
const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  bulkUpload,
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
