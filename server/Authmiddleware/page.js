import jwt from "jsonwebtoken";
import prisma from "../config/db.config.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.email) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const user = await prisma.student1.findUnique({ where: { email: decoded.email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};

export default authMiddleware;
