import { Request, Response } from "express";
import { BookService } from "./book.service.js";
import { createBookSchema, updateBookSchema } from "./book.schema.js";
import { asyncHandler } from "../../utils/async-handler.js";

export class BookController {
  private service: BookService;

  constructor() {
    this.service = new BookService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const books = await this.service.getAllBooks();
    res.status(200).json(books);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedId = parseInt(id as string);
    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    const book = await this.service.getBookById(parsedId);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.status(200).json(book);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createBookSchema.parse(req.body);
    const book = await this.service.createBook(validatedData);
    res.status(201).json(book);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedId = parseInt(id as string);
    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    const validatedData = updateBookSchema.parse(req.body);
    const book = await this.service.updateBook(parsedId, validatedData);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.status(200).json(book);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedId = parseInt(id as string);
    if (isNaN(parsedId)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    const book = await this.service.deleteBook(parsedId);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.status(200).json({ message: "Book deleted successfully" });
  });
}
