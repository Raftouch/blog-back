import express from "express";
import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  articleCreateValidation,
} from "./validations.js";
import checkAuth from "./middleware/auth.middleware.js";
import * as UserController from "./controllers/UserController.js";
import * as ArticleController from "./controllers/ArticleController.js";

const app = express();

mongoose
  .connect(
    "mongodb+srv://rafa:Uy6PES6HxKA8UTV@cluster0.oinetw9.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB works perfectly"))
  .catch((err) => console.log("DB error occured", err));

app.use(express.json());

// info about me (about a user) --> check if we can give access == decode token --> create auth.middleware
app.post("/auth/register", registerValidation, UserController.register);
app.post("/auth/login", loginValidation, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMyInfo);

app.get("/articles", ArticleController.getAll);
app.get("/articles/:id", ArticleController.getOne);
app.post(
  "/articles",
  checkAuth,
  articleCreateValidation,
  ArticleController.create
);
app.delete("/articles/:id", checkAuth, ArticleController.remove);
app.patch("/articles/:id", checkAuth, ArticleController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is running on port 4444");
});
