import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error-middleware.js";
import helmet from "helmet";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

const app = express();

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.json({ limit: "50mb" }));

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export { app };
