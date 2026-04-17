// middlewares/authMiddleware.ts
import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
    // console.log('headers = ', req.query);
    const authHeader = req.headers.authorization;
    if (!authHeader ||
        (authHeader && !authHeader.startsWith('Bearer ') && !authHeader.startsWith('JWT '))) {
        return res.status(401).json({ error: 'No token provided in auth middleware' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided in auth middleware' });
    }
    try {
        // console.log('token = ', token);
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
        const decoded = jwt.verify(token, jwtSecret);
        // attach current user id to request
        req.user = { id: decoded.userId, email: decoded.email };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
//# sourceMappingURL=authMiddleware.js.map