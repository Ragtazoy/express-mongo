const express = require("express");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const { ErrorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);

app.use(ErrorHandler);

app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
});
