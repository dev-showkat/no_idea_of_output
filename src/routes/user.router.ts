import { Router } from "express";
import { registerUser, signinUser, updateUser, deleteUser } from "../controllers/user.controller"
import { isAuthorized } from "../middlewares/authorisation";

export const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/signin', signinUser);
userRouter.put('/update', isAuthorized, updateUser);
userRouter.delete('/delete', isAuthorized, deleteUser);

