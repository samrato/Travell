const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const Authorization = req.headers.authorization;

    if (!Authorization || !Authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = Authorization.split(" ")[1];

    // Verify Token
    const info = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID and exclude password
    const user = await User.findById(info.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
