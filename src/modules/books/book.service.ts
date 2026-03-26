import { BookRepository } from "./book.repository.js";
import { CreateBookInput, UpdateBookInput } from "./book.schema.js";
import { Book } from "../../generated/prisma/client.js";

export class BookService {
  private repository: BookRepository;

  constructor() {
    this.repository = new BookRepository();
  }

  async getAllBooks(): Promise<Book[]> {
    return await this.repository.getAll();
  }

  async getBookById(id: number): Promise<Book | null> {
    return await this.repository.getById(id);
  }

  async createBook(data: CreateBookInput): Promise<Book> {
    return await this.repository.create(data);
  }

  async updateBook(id: number, data: UpdateBookInput): Promise<Book | null> {
    const book = await this.repository.getById(id);
    if (!book) return null;
    return await this.repository.update(id, data);
  }

  async deleteBook(id: number): Promise<Book | null> {
    const book = await this.repository.getById(id);
    if (!book) return null;
    return await this.repository.delete(id);
  }
}
