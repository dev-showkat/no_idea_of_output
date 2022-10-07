import path from "path";
import { Router } from "express";
export const userRouter = Router();
import multer, { diskStorage } from "multer";
import { isAuthorized } from "../middlewares/authorisation";
import { registerUser, signinUser, updateUser, deleteUser } from "../controllers/user.controller"

const upload = multer({
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../Avatars'));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname);
        }
    })
});

userRouter.post('/register', upload.single('avatar'), registerUser);
userRouter.post('/signin', signinUser);
userRouter.put('/update', isAuthorized, upload.single('avatar'), updateUser);
userRouter.delete('/delete', isAuthorized, deleteUser);

