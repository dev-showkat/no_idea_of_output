import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import firebaseAdmin from "firebase-admin";
import jwt from "jsonwebtoken";
import multer from "multer";
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const upload = multer();
    upload.single('imgUrl');
    
    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "invalid data"
            });
        }
        const usersRef = firebaseAdmin.firestore().collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(400).json({
                message: "user already exists"
            });
        }
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const imgUrl = '';
        const userRef = await usersRef.add({
            username,
            email,
            imgUrl,
            password: hashedPassword,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        const userDoc = await userRef.get();
        //Todo: get profile picture url
        const token = jwt.sign({ id: userRef.id, email }, process.env.JWT_SECRET_KEY as string, { expiresIn: '12h' });
        return res.status(201).json({
            token,
            id: userRef.id,
            username,
            email
        });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            message: "something went wrong"
        });
    }
}

export const signinUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required"
            });
        }
        const userRef = firebaseAdmin.firestore().collection('users').where('email', '==', email);
        const userDoc = await userRef.get();
        if (userDoc.empty) {
            return res.status(400).json({
                message: "invalid email address"
            });
        }
        const userData = userDoc.docs[0].data()
        const isPasswordCorrect = await bcrypt.compare(password, userData.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "invalid password"
            });
        }
        const token = jwt.sign({ id: userDoc.docs[0].id, email }, process.env.JWT_SECRET_KEY as string, { expiresIn: '12h' });
        return res.status(200).json({
            token
        });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            message: "something went wrong"
        });
    }

}

export const updateUser = async (req: any, res: Response) => {
    const { email, username } = req.body;
    try {
        if (!email || !username || email !== req.user.email) {
            return res.status(400).json({
                message: "email is required"
            });
        }
        const userRef = firebaseAdmin.firestore().collection('users').doc(req.user.id);
        await userRef.update({ username, updatedAt: Date.now() });
        res.status(200).json({ email, username })
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            message: "something went wrong"
        });
    }
}

export const deleteUser = async (req: any, res: Response) => {
    const { email, password } = req.body;
    try {
        if (!email || !password || email !== req.user.email) {
            return res.status(400).json({
                message: "incorrect email or password"
            });
        }
        const userRef = firebaseAdmin.firestore().collection('users').doc(req.user.id);
        const userDoc = await userRef.get();
        const hashedPassword = userDoc.data()?.password;
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "invalid password"
            });
        }
        await userRef.delete();
        res.status(200).json({ message: "account deleted successfully" })
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            message: "something went wrong"
        });
    }
}