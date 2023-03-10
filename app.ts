import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", [
    "PUT",
    "POST",
    "GET",
    "OPTIONS",
  ]);
  next();
});

// Connection URI
const uri = process.env.MONGODB_CONNECTION_STRING!;
// Create a new MongoClient
const client = new MongoClient(uri);
async function connectAndRun() {
  try {
    await client.connect();
    await client.db("techkraft").command({ ping: 1 });
    console.log("Connected successfully to Database");
    //run the server
    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  } catch (error) {
    console.log(`Error Connecting to Database ${error}`);
    await client.close();
  }
}
app.get("/order_items", (req: Request, res: Response) => {
  res.send("welcome");
});
app.delete("/order_items/:id", (req: Request, res: Response) => {
  res.send("welcome");
});
app.put("/account", (req: Request, res: Response) => {
  res.send("welcome");
});
connectAndRun();

//define a port
const port = process.env.PORT || 3000;

