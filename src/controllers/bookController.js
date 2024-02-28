const Book = require("../models/bookModel");
const Author = require("../models/authorModel");
const { AppError } = require("../middlewares/errorHandler");

class BookController {
  static async addBook(req, res, next) {
    try {
      // check if author exists
      const existAuthor = await Author.findById(req.body.authorId);
      if (!existAuthor) {
        return next(AppError.NotFound("Author not found"));
      }

      // create new book
      const newBook = new Book(req.body);
      await newBook.save();

      // update author's books
      existAuthor.books.push(newBook._id);
      await existAuthor.save();

      res.status(200).send({ message: "Book created successfully!" });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async getBooks(req, res, next) {
    // validate page and limit values
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (!page || !limit) {
      return next(
        AppError.BadRequest("Page and limit is required and must be numbers.")
      );
    }

    const skip = (page - 1) * limit;

    try {
      const books = await Book.find().skip(skip).limit(limit);

      res.status(200).send({ data: books });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async getBookById(req, res, next) {
    try {
      const book = await Book.findById(req.params.id).populate("authorId");

      if (!book) {
        return next(AppError.NotFound("Book not found"));
      }

      res.status(200).send({ data: book });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async updateBook(req, res, next) {
    try {
      // check if book exists
      const existBook = await Book.findById(req.params.id);
      if (!existBook) {
        return next(AppError.NotFound("Book not found"));
      }

      // update book
      await Book.findByIdAndUpdate(req.params.id, req.body);

      res.status(200).send({ message: "Book updated successfully!" });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async deleteBook(req, res, next) {
    try {
      // check if book exists
      const existBook = await Book.findById(req.params.id);
      if (!existBook) {
        return next(AppError.NotFound("Book not found"));
      }

      // delete book
      await Book.findByIdAndDelete(req.params.id);

      res.status(200).send({ message: "Book deleted successfully!" });
    } catch (error) {
      next(error);
      return;
    }
  }
}

module.exports = BookController;
