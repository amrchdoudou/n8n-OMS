// middlewares/authMiddleware.ts
import jwt from 'jsonwebtoken';
import { prisma } from "../Services/Common.js";
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];
    // 1. Try API Key Authentication
    if (apiKey) {
        try {
            const user = await prisma.user.findFirst({
                where: { apiKey: apiKey },
            });
            if (user) {
                req.user = { id: user.id, email: user.email };
                return next();
            }
        }
        catch (err) {
            console.error('API Key auth error:', err);
        }
    }
    // 2. Try JWT Authentication
    if (authHeader && (authHeader.startsWith('Bearer ') || authHeader.startsWith('JWT '))) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const jwtSecret = process.env.JWT_SECRET;
                if (!jwtSecret) {
                    throw new Error('JWT_SECRET environment variable is not set');
                }
                const decoded = jwt.verify(token, jwtSecret);
                req.user = { id: decoded.userId, email: decoded.email };
                return next();
            }
            catch (err) {
                // If JWT fails but API Key was already tried, we fall through to 401
            }
        }
    }
    return res.status(401).json({ error: 'Authentication failed: No valid token or API key provided' });
};
//# sourceMappingURL=authMiddleware.js.map