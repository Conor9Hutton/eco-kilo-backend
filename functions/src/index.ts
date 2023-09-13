import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import homeRouter from "./routes/homeRouter";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", homeRouter);
export const api = functions.https.onRequest(app);
