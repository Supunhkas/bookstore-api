import { prisma } from '../../db/prisma.js';
import { Book } from '../../generated/prisma/client.js';
import { CreateBookInput, UpdateBookInput } from './book.schema.js';

export class BookRepository {
  async getAll(): Promise<Book[]> {
    return await prisma.book.findMany();
  }

  async getById(id: number): Promise<Book | null> {
    return await prisma.book.findUnique({
      where: { id },
    });
  }

  async create(data: CreateBookInput): Promise<Book> {
    return await prisma.book.create({
      data,
    });
  }

  async update(id: number, data: UpdateBookInput): Promise<Book> {
    return await prisma.book.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Book> {
    return await prisma.book.delete({
      where: { id },
    });
  }
}
