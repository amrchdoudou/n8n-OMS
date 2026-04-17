import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
export const prisma = new PrismaClient();
const SaveFolderPath = 'uploads/';
const HashPassword = (password) => {
    const hash = crypto.createHmac('sha256', process.env.Hash_key).update(password).digest('hex');
    return hash;
};
const GenerateJwtToken = (userId, email) => {
    // Implementation for generating JWT token
    const token = jwt.sign({ userId, email, type: 'access' }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    return token;
};
const GenerateRefreshToken = (userId, email) => {
    // Implementation for generating JWT token
    const token = jwt.sign({ userId, email, type: 'refresh' }, process.env.JWT_SECRET, {
        expiresIn: '100d',
    });
    return token;
};
export { HashPassword, GenerateJwtToken, GenerateRefreshToken, };
//# sourceMappingURL=Common.js.map