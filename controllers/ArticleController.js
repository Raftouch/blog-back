import ArticleModel from "../models/Article.js";

export const getAll = async (req, res) => {
  try {
    const articles = await ArticleModel.find().populate("author").exec();
    res.json(articles);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Articles not found" });
  }
};

export const getOne = async (req, res) => {
  try {
    const articleId = req.params.id;

    ArticleModel.findOneAndUpdate(
      {
        _id: articleId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(doc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Articles not found. Problem on server" });
  }
};

export const remove = async (req, res) => {
  try {
    const articleId = req.params.id;

    ArticleModel.findOneAndDelete({
      _id: articleId,
    }).then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({
        message: "Article successfully removed",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Articles not found. Problem on server" });
  }
};

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

export const update = async (req, res) => {
  try {
    const articleId = req.params.id;

    await ArticleModel.updateOne(
      {
        _id: articleId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        author: req.userId,
      }
    );

    res.json({ message: "Article updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Article update failed" });
  }
};
