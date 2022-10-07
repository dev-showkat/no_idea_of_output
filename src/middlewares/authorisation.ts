import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import firebaseAdmin from "firebase-admin"

export const isAuthorized = async (req: any, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    try {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "unauthorized: token is missing"
            })
        }
        const token = authorization.split(' ')[1];
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const { id, email } = decodedToken;
        const userRef = firebaseAdmin.firestore().collection('users').doc(id);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(401).json({
                message: "user doesn't exists"
            })
        }
        const registeredEmail = doc.data()?.email;
        if (email !== registeredEmail) {
            return res.status(401).json({
                message: "unauthorized:  invalid email"
            })
        }
        req.user = { id, email }
        next();
    } catch (error: any) {
        console.log(error?.message);
        return res.status(500).json({
            message: "unauthorized: invalid token"
        })
    }
}