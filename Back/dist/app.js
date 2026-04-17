// src/app.ts
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';
/////////////////////////////////
const app = express();
app.use(cors()); // Allow requests from any origin (all ports)
//app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use('/users', userRoutes); // mount routes
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
/////////////////////////////////
export default app;
//# sourceMappingURL=app.js.map