import { Router } from "express";
import { BookController } from "./book.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const booksRouter = Router();
const controller = new BookController();

booksRouter.use(authMiddleware);

booksRouter.get("/", controller.getAll);
booksRouter.get("/:id", controller.getById);
booksRouter.post("/", controller.create);
booksRouter.put("/:id", controller.update);
booksRouter.delete("/:id", controller.delete);

export default booksRouter;
