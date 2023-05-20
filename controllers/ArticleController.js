import ArticleModel from "../models/Article";

export const create = async (req, res) => {
  try {
    const doc = new ArticleModel({
      // the part that is entered by a user
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      // the part from backend
      author: req.userId,
    });

    const article = await doc.save();
    res.json(article);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Article creation failed" });
  }
};
