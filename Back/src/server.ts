// src/server.ts
import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables from .env file
dotenv.config();

console.log('port = ', process.env.PORT);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
