const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const { authenticateAdminToken } = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Create a product (admin only)
router.post("/", authenticateAdminToken, productController.createProduct);

// Bulk Upload Products (admin only)
router.post(
  "/bulk",
  upload.single("file"),
  authenticateAdminToken,
  productController.bulkUpload
);

// Get all products
router.get("/", productController.getAllProducts);

// Get a product by ID
router.get("/:id", productController.getProductById);

// Update a product by ID (admin only)
router.put("/:id", authenticateAdminToken, productController.updateProductById);

// Delete a product by ID (admin only)
router.delete(
  "/:id",
  authenticateAdminToken,
  productController.deleteProductById
);

module.exports = router;
