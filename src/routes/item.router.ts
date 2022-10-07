import { Router } from "express";
import { isAuthorized } from "../middlewares/authorisation";
import { createItem, getItems, updateItem, deleteItem } from "../controllers/item.controller"

export const itemRouter = Router();

itemRouter.post('/', isAuthorized, createItem);
itemRouter.get('/', isAuthorized, getItems);
itemRouter.put('/:id', isAuthorized, updateItem);
itemRouter.delete('/:id', isAuthorized, deleteItem);