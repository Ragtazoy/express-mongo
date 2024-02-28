const { AppError } = require("../middlewares/errorHandler");
const Author = require("../models/authorModel");

class AuthorController {
  static async addAuthor(req, res, next) {
    try {
      const newAuthor = new Author(req.body);
      await newAuthor.save();

      res.status(201).send({ message: "Author created successfully!" });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async getAuthors(req, res, next) {
    try {
      // validate page and limit values
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      if (!page || !limit) {
        return next(
          AppError.BadRequest("Page and limit is required and must be numbers.")
        );
      }

      const skip = (page - 1) * limit;

      const authors = await Author.find().skip(skip).limit(limit);

      res.status(200).send({ data: authors });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async getAuthorById(req, res, next) {
    try {
      const author = await Author.findById(req.params.id).populate("books", {
        authorId: false,
      });

      if (!author) {
        return next(AppError.NotFound("Author not found"));
      }

      res.status(200).send({ data: author });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async updateAuthor(req, res, next) {
    try {
      // check if author exists
      const existAuthor = await Author.findById(req.params.id);
      if (!existAuthor) {
        return next(AppError.NotFound("Author not found"));
      }

      // update author
      await Author.findByIdAndUpdate(req.params.id, req.body);

      res.status(200).send({ message: "Author updated successfully!" });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async deleteAuthor(req, res, next) {
    try {
      // check if author exists
      const existAuthor = await Author.findById(req.params.id);
      if (!existAuthor) {
        return next(AppError.NotFound("Author not found"));
      }

      // delete author
      await Author.findByIdAndDelete(req.params.id);

      res.status(200).send({ message: "Author deleted successfully!" });
    } catch (error) {
      next(error);
      return;
    }
  }
}

module.exports = AuthorController;
