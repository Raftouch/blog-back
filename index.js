import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config()

import {
  registerValidation,
  loginValidation,
  articleCreateValidation,
} from "./validations.js";
import { UserController, ArticleController } from "./controllers/main.js";
import { checkAuth, handleValidationErrors } from "./middleware/main.js";

const port = process.env.PORT || 4444

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB works perfectly"))
  .catch((err) => console.log("DB error occured", err));

// info about me (about a user) --> check if we can give access == decode token --> create auth.middleware
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMyInfo);

app.get("/articles", ArticleController.getAll);
app.get("/articles/:id", ArticleController.getOne);
app.post(
  "/articles",
  checkAuth,
  articleCreateValidation,
  handleValidationErrors,
  ArticleController.create
);
app.delete("/articles/:id", checkAuth, ArticleController.remove);
app.patch(
  "/articles/:id",
  checkAuth,
  articleCreateValidation,
  handleValidationErrors,
  ArticleController.update
);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${port}`);
});
