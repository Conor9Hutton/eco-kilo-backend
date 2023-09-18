import express from "express";
import { getClient } from "../db";
import Home from "../models/Home";
import { ObjectId } from "mongodb";

const homeRouter = express.Router();

// call within try/catch to catch and log any errors
const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// homeRouter.get("/users/:googleId/homes", async(req, res)=> {
//     try{

//     } catch(err){
//         errorResponse(err, res)
//     }
// })

homeRouter.get("/users/:googleId/homes", async (req, res) => {
  try {
    const googleId: string = req.params.googleId;
    const client = await getClient();
    const cursor = client.db().collection<Home>("homes").find({ googleId });
    const results = await cursor.toArray();
    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

homeRouter.post("/users/homes", async (req, res) => {
  try {
    const newHome: Home = req.body;
    console.log(newHome);
    const client = await getClient();
    await client.db().collection<Home>("homes").insertOne(newHome);
    res.status(201).json(newHome);
  } catch (err) {
    errorResponse(err, res);
  }
});

// deleted googleId from params and body, worked to delete one home
homeRouter.delete("/homes/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client
      .db()
      .collection<Home>("homes")
      .deleteOne({ _id });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// got rid of /users/:googleId
homeRouter.put("/homes/:id", async (req, res) => {
  try {
    const updatedHome: Home = req.body;
    delete updatedHome._id;
    const _id: ObjectId = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client
      .db()
      .collection<Home>("homes")
      .replaceOne({ _id }, updatedHome);
    if (result.modifiedCount) {
      res.status(200).json(updatedHome);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default homeRouter;
