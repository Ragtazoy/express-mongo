const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    unique: true,
  },
  description: { type: String },
  price: { type: Number, required: [true, "Price is required."] },
  releasedDate: { type: Date, default: Date.now },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: [true, "Author id is required."],
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
