const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const Authorization = req.headers.authorization;

        if (!Authorization || !Authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = Authorization.split(" ")[1];

        // Verify Token
        const info = jwt.verify(token, process.env.JWT_SECRET);

        // Attach User to Request
        req.user = info;
        next();
    } catch (err) {
        console.error(err)
        return res.status(403).json({message:"Unauthorized Invalid token"})
        
    }
};

module.exports = authMiddleware;
