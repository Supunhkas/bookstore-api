import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';
import type { Book } from '../../generated/prisma/client.js';

// Shared mock functions
const mockGetAllBooks = jest.fn<() => Promise<Book[]>>();
const mockGetBookById = jest.fn<(id: number) => Promise<Book | null>>();
const mockCreateBook = jest.fn<(data: unknown) => Promise<Book>>();
const mockUpdateBook = jest.fn<(id: number, data: unknown) => Promise<Book | null>>();
const mockDeleteBook = jest.fn<(id: number) => Promise<Book | null>>();

//services
jest.unstable_mockModule('./book.service.js', () => ({
  BookService: jest.fn().mockImplementation(() => ({
    getAllBooks: mockGetAllBooks,
    getBookById: mockGetBookById,
    createBook: mockCreateBook,
    updateBook: mockUpdateBook,
    deleteBook: mockDeleteBook,
  })),
}));

const { BookController } = await import('./book.controller.js');

describe('BookController', () => {
  let controller: InstanceType<typeof BookController>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let nextMock: jest.Mock;

  const mockBook: Book = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    year: 2024,
    genre: 'Fiction',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new BookController();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    nextMock = jest.fn();

    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
  });

  // get all books
  describe('getAll', () => {
    it('should return all books with 200 OK', async () => {
      mockGetAllBooks.mockResolvedValue([mockBook]);

      await controller.getAll(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([mockBook]);
      expect(mockGetAllBooks).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array with 200 OK when no books exist', async () => {
      mockGetAllBooks.mockResolvedValue([]);

      await controller.getAll(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([]);
    });
  });

  // get book by id
  describe('getById', () => {
    it('should return a book with 200 OK when found', async () => {
      mockRequest.params = { id: '1' };
      mockGetBookById.mockResolvedValue(mockBook);

      await controller.getById(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockBook);
      expect(mockGetBookById).toHaveBeenCalledWith(1);
    });

    it('should return 400 when ID is not a number', async () => {
      mockRequest.params = { id: 'invalid' };

      await controller.getById(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID format' });
      expect(mockGetBookById).not.toHaveBeenCalled();
    });

    it('should return 404 when book is not found', async () => {
      mockRequest.params = { id: '999' };
      mockGetBookById.mockResolvedValue(null);

      await controller.getById(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Book not found' });
      expect(mockGetBookById).toHaveBeenCalledWith(999);
    });
  });

  // create book
  describe('create', () => {
    it('should create a book and return 201 Created', async () => {
      const createData = { title: 'New Book', author: 'Author', year: 2024 };
      const createdBook: Book = { id: 2, genre: null, ...createData };
      mockRequest.body = createData;
      mockCreateBook.mockResolvedValue(createdBook);

      await controller.create(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdBook);
      expect(mockCreateBook).toHaveBeenCalledWith(createData);
    });

    it('should call next() with a ZodError when body validation fails', async () => {
      mockRequest.body = {};

      await controller.create(mockRequest as Request, mockResponse as Response, nextMock);

      expect(nextMock).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  // update book
  describe('update', () => {
    it('should update a book and return 200 OK when found', async () => {
      mockRequest.params = { id: '1' };
      const updateData = { title: 'Updated' };
      mockRequest.body = updateData;
      const updatedBook: Book = { ...mockBook, ...updateData };
      mockUpdateBook.mockResolvedValue(updatedBook);

      await controller.update(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedBook);
      expect(mockUpdateBook).toHaveBeenCalledWith(1, updateData);
    });

    it('should return 400 when ID is invalid for update', async () => {
      mockRequest.params = { id: 'abc' };

      await controller.update(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 404 when book to update is not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { title: 'Update' };
      mockUpdateBook.mockResolvedValue(null);

      await controller.update(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Book not found' });
      expect(mockUpdateBook).toHaveBeenCalledWith(999, { title: 'Update' });
    });
  });

  // delete book
  describe('delete', () => {
    it('should delete a book and return 200 OK with success message', async () => {
      mockRequest.params = { id: '1' };
      mockDeleteBook.mockResolvedValue(mockBook);

      await controller.delete(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Book deleted successfully',
      });
      expect(mockDeleteBook).toHaveBeenCalledWith(1);
    });

    it('should return 400 when ID is invalid for delete', async () => {
      mockRequest.params = { id: 'xyz' };

      await controller.delete(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 404 when book to delete is not found', async () => {
      mockRequest.params = { id: '999' };
      mockDeleteBook.mockResolvedValue(null);

      await controller.delete(mockRequest as Request, mockResponse as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Book not found' });
      expect(mockDeleteBook).toHaveBeenCalledWith(999);
    });
  });
});
