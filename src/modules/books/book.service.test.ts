import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { Book } from "../../generated/prisma/client.js";

const mockGetAll = jest.fn<() => Promise<Book[]>>();
const mockGetById = jest.fn<(id: number) => Promise<Book | null>>();
const mockCreate = jest.fn<(data: unknown) => Promise<Book>>();
const mockUpdate = jest.fn<(id: number, data: unknown) => Promise<Book>>();
const mockDelete = jest.fn<(id: number) => Promise<Book>>();

jest.unstable_mockModule("./book.repository.js", () => ({
  BookRepository: jest.fn().mockImplementation(() => ({
    getAll: mockGetAll,
    getById: mockGetById,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  })),
}));

const { BookService } = await import("./book.service.js");

describe("BookService", () => {
  let service: InstanceType<typeof BookService>;

  const mockBook: Book = {
    id: 1,
    title: "Test Book",
    author: "Test Author",
    year: 2024,
    genre: "Fiction",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookService();
  });

  // get all books
  describe("getAllBooks", () => {
    it("should return all books", async () => {
      mockGetAll.mockResolvedValue([mockBook]);

      const result = await service.getAllBooks();

      expect(result).toEqual([mockBook]);
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when there are no books", async () => {
      mockGetAll.mockResolvedValue([]);

      const result = await service.getAllBooks();

      expect(result).toEqual([]);
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });
  });

  // get book by id
  describe("getBookById", () => {
    it("should return a book when it exists", async () => {
      mockGetById.mockResolvedValue(mockBook);

      const result = await service.getBookById(1);

      expect(result).toEqual(mockBook);
      expect(mockGetById).toHaveBeenCalledWith(1);
    });

    it("should return null when the book does not exist", async () => {
      mockGetById.mockResolvedValue(null);

      const result = await service.getBookById(999);

      expect(result).toBeNull();
      expect(mockGetById).toHaveBeenCalledWith(999);
    });
  });

  // create book
  describe("createBook", () => {
    it("should create and return a new book", async () => {
      const createInput = { title: "New Book", author: "Author", year: 2024 };
      const createdBook: Book = { ...mockBook, ...createInput };
      mockCreate.mockResolvedValue(createdBook);

      const result = await service.createBook(createInput);

      expect(result).toEqual(createdBook);
      expect(mockCreate).toHaveBeenCalledWith(createInput);
    });
  });

  // update book
  describe("updateBook", () => {
    it("should update and return the book when it exists", async () => {
      const updateInput = { title: "Updated Title" };
      const updatedBook: Book = { ...mockBook, ...updateInput };

      mockGetById.mockResolvedValue(mockBook);
      mockUpdate.mockResolvedValue(updatedBook);

      const result = await service.updateBook(1, updateInput);

      expect(result).toEqual(updatedBook);
      expect(mockGetById).toHaveBeenCalledWith(1);
      expect(mockUpdate).toHaveBeenCalledWith(1, updateInput);
    });

    it("should return null and skip update when the book does not exist", async () => {
      mockGetById.mockResolvedValue(null);

      const result = await service.updateBook(999, { title: "Ghost" });

      expect(result).toBeNull();
      expect(mockGetById).toHaveBeenCalledWith(999);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  // delete book
  describe("deleteBook", () => {
    it("should delete and return the book when it exists", async () => {
      mockGetById.mockResolvedValue(mockBook);
      mockDelete.mockResolvedValue(mockBook);

      const result = await service.deleteBook(1);

      expect(result).toEqual(mockBook);
      expect(mockGetById).toHaveBeenCalledWith(1);
      expect(mockDelete).toHaveBeenCalledWith(1);
    });

    it("should return null and skip delete when the book does not exist", async () => {
      mockGetById.mockResolvedValue(null);

      const result = await service.deleteBook(999);

      expect(result).toBeNull();
      expect(mockGetById).toHaveBeenCalledWith(999);
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });
});
