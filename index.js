import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { registerValidation } from "./validation/auth.validation.js";
import { validationResult } from "express-validator";
import User from "./models/User.js";

const app = express();

mongoose
  .connect(
    "mongodb+srv://rafa:Uy6PES6HxKA8UTV@cluster0.oinetw9.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB works perfectly"))
  .catch((err) => console.log("DB error occured", err));

app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // before creating a user
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a user in MongoDB
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatarUrl: req.body.avatarUrl,
    });

    const newUser = await user.save();

    const token = jwt.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "1h",
    });

    res.json({ newUser, message: "Registration successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if user found, check for password
    const isValidated = await bcrypt.compare(req.body.password, user.password);

    if (!isValidated) {
      return res.status(400).json({ message: "Wrong credentials" });
    }
    // 400 bad request

    const token = jwt.sign({ _id: user._id }, "secretkey123", {
      expiresIn: "1h",
    });

    res.json({ user, message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is running on port 4444");
});
