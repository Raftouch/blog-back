import { body } from "express-validator";

export const loginValidation = [
  body("email", "Please enter valid email").isEmail(),
  body("password", "Min 5 characters").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", "Please enter valid email").isEmail(),
  body("password", "Min 5 characters").isLength({ min: 5 }),
  body("name", "Please enter valid name").isLength({ min: 3 }),
  body("avatarUrl", "Wrong url").optional().isURL(),
];

export const articleCreateValidation = [
  body("title", "Please enter a title").isLength({ min: 3 }).isString(),
  body("text", "Please enter your text").isLength({ min: 10 }).isString(),
  body("tags", "Wrong tag format, should be an array").optional().isString(),
  body("imageUrl", "Wrong url").optional().isString(),
];
