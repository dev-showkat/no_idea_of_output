import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConfig } from "./config/db.config";
import express, { Application } from "express";
import { config as dotEnvConfig } from "dotenv";
import { itemRouter } from "./routes/item.router";
import { userRouter } from "./routes/user.router";

dotEnvConfig();
dbConfig();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string) || 4321;

app.use(cors({ origin: ['http://localhost:3000'] }))
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);

app.listen(port, () => {
    console.log(`server is runnig at: http://localhost:${port}`);
})
