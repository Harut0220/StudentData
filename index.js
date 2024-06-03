import express from "express";
import cors from "cors";
import path from "path";
import productRouter from "./Route/ProductRoute.js";
import { fileURLToPath } from "url";

import { config } from "dotenv";


const app = express();
app.use(express.json());
app.use(cors());
// const con = connection();
const dotenv = config()

app.set("view engine", "ejs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "Public")));

app.use("/api", productRouter);






app.listen(process.env.PORT, () => {
  console.log(`server run in ${process.env.PORT} port`);
});
