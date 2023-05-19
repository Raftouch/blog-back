import jwt from "jsonwebtoken";

// middleware --> needed to decide if we can give access to secret info
// --> we need to parse token and then decode it

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, "secretkey123");
      // if we can decode --> we extract id from token
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Authorization failed" });
    }
  } else {
    return res.status(403).json({ message: "No access" });
  }
  // res.send(token)
};
