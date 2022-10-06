import express, { Application } from "express";
import dotenv from "dotenv";
import { dbConfig } from "./config/db.config";
import { itemRouter } from "./routes/item.router";
import { userRouter } from "./routes/user.router";
import cors from "cors";


dotenv.config();
dbConfig();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string) || 4321;
app.use(cors({
    origin: ['http://localhost:3000']
}))
app.use(express.json());
app.use('/api/items', itemRouter);
app.use('/api/users', userRouter);


app.listen(port, () => {
    console.log(`server is runnig at: http://localhost:${port}`);
})
