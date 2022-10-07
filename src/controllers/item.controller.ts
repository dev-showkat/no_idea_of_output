import { Request, Response } from "express";
import firebaseAdmin from "firebase-admin"

export const createItem = async (req: any, res: Response) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({
                message: "name is required"
            })
        }
        const itemRef = await firebaseAdmin.firestore().collection('items').add({
            name,
            createdBy: `${req.user.id}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
        const doc = await itemRef.get();
        return res.status(201).json({
            message: "item created successfully",
            item: {
                id: itemRef.id,
                ...doc.data()
            }
        })
    } catch (error: any) {
        console.log(error?.message)
        return res.status(500).json({
            message: "something went wrong"
        })
    }
}

export const getItems = async (req: any, res: Response) => {
    let items: any[] = [];
    try {
        const itemsRef = firebaseAdmin.firestore().collection('items');
        const snapshot = await itemsRef.where('createdBy', '==', req.user.id).get();
        if (snapshot.empty) {
            return res.status(200).json(
                items
            )
        }
        snapshot.forEach(doc => {
            items.push({
                id: doc.id,
                ...doc.data()
            })
        });
        return res.status(200).json(
            items
        )
    }
    catch (error: any) {
        console.log(error?.message)
        return res.status(500).json({
            message: "something went wrong"
        })
    }
}


export const updateItem = async (req: any, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!id || !name) {
            return res.status(400).json({
                message: "invalid data"
            })
        }
        const itemRef = firebaseAdmin.firestore().collection('items').doc(id);
        const doc = await itemRef.get();
        if (!doc.exists) {
            return res.status(401).json({
                message: "item not found"
            })
        }
        const createdBy = doc.data()?.createdBy;
        if (createdBy !== req.user.id) {
            return res.status(201).json({
                message: "item can't be updated",
            })
        }
        await itemRef.update({
            name,
            updatedAt: Date.now()
        })
        const updatedDoc = await itemRef.get();
        return res.status(201).json({
            message: "item updated successfully",
            item: {
                id: itemRef.id,
                ...updatedDoc.data()
            }
        })
    } catch (error: any) {
        console.log(error?.message)
        return res.status(500).json({
            message: "something went wrong"
        })
    }
}

export const deleteItem = async (req: any, res: Response) => {
    const { id } = req.params;
    try {
        const userRef = firebaseAdmin.firestore().collection('users').doc(req.user.id);
        if (!id) {
            return res.status(400).json({
                message: "invalid data"
            })
        }
        const itemRef = firebaseAdmin.firestore().collection('items').doc(id);
        const doc = await itemRef.get();
        if (!doc.exists) {
            return res.status(404).json({
                message: "item not found"
            })
        }
        const createdBy = doc.data()?.createdBy;
        if (createdBy !== req.user.id) {
            return res.status(201).json({
                message: "item can't be deleted",
            })
        }
        await itemRef.delete();
        return res.status(200).json({
            id: itemRef.id,
            message: "item deleted successfully"
        })
    } catch (error: any) {
        console.log(error?.message)
        return res.status(500).json({
            message: "something went wrong"
        })
    }
}