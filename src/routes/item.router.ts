import { Router } from "express";
import { createItem, getItems, updateItem, deleteItem } from "../controllers/item.controller"

export const itemRouter = Router();

itemRouter.post('/', createItem);
itemRouter.get('/', getItems);
itemRouter.put('/:id', updateItem);
itemRouter.delete('/:id', deleteItem);