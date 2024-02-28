const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorSchema = new Schema({
  fname: { type: String, required: [true, "First name is required."] },
  lname: { type: String, required: [true, "Last name is required."] },
  additionalName: { type: String, required: [true, "Additional name is required."], unique: true },
  birthDate: { type: Date },
  books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
