import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    // before creating a user
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a user in MongoDB
    const doc = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, "secretkey123", {
      expiresIn: "1h",
    });

    res.json({ user, message: "Registration successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if user found, check for password
    const isValidated = await bcrypt.compare(req.body.password, user.password);

    if (!isValidated) {
      return res.status(400).json({ message: "Wrong credentials" });
    }
    // 400 bad request

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ user, message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const getMyInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({ user, message: "Auth successful" });

    // const {passwordHash, ...userData} = user._doc
    // res.json({ ...userData, token })
  } catch (error) {}
};
