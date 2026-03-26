import express from "express";
import cors from "cors";
import booksRouter from "./modules/books/book.route.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the Bookstore API");
});

// Routes
app.use("/books", booksRouter);

// Error Handling
app.use(errorMiddleware);

export default app;
