const express = require("express");
const router = express.Router();

const BookController = require("../controllers/bookController");

router.post("/", BookController.addBook);
router.get("/", BookController.getBooks);
router.get("/:id", BookController.getBookById);
router.put("/:id", BookController.updateBook);
router.delete("/:id", BookController.deleteBook);

module.exports = router;
