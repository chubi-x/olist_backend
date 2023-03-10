import express from "express";
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
async function connectToDb() {
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
connectToDb();

//define a port
const port = process.env.PORT || 3000;
