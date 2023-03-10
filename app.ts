import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import basicAuth, { IBasicAuthedRequest } from "express-basic-auth";
dotenv.config();
const app = express();

/**DB CONNECTION */
const uri = process.env.MONGODB_CONNECTION_STRING!;
const client = new MongoClient(uri);
let db: Db;
let sellers: Collection;
// let orders:Collection
async function connectAndRun() {
  try {
    await client.connect();
    db = client.db("techkraft");
    sellers = db.collection("sellers");
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
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
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

/**BASIC AUTHENTICATION */
const authenticateUser = async (
  seller_id: string,
  seller_zip_code_prefix: string,
  callback: (error: any, result: boolean) => void
) => {
  try {
    const user = await sellers.findOne({ seller_id });
    if (
      user &&
      basicAuth.safeCompare(seller_zip_code_prefix, user.seller_zip_code_prefix)
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  } catch (error) {
    console.error(error);
    callback(error, false);
  }
};
function getUnauthorizedResponse(req: IBasicAuthedRequest) {
  return req.auth
    ? "Credentials " + req.auth.user + ":" + req.auth.password + " rejected"
    : "No credentials provided";
}

app.use(
  basicAuth({
    authorizer: authenticateUser,
    authorizeAsync: true,
    unauthorizedResponse: getUnauthorizedResponse,
  })
);

app.get("", async (req: Request, res: Response) => {
  res.send("Welcome to olist backend");
});
app.get("/order_items", (req: Request, res: Response) => {
  //   console.log(req.auth);
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

