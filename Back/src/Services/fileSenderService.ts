// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';

const SendingService = async (req: Request, res: Response) => {
  const filePath = req.headers['file-name'] as string;
  //

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(400).json({ error: 'Invalid or missing file path' });
  }

  // Create a writable stream for saving the uploaded file
  const readStream = fs.createReadStream(filePath, {
    highWaterMark: 64 * 1024, // 64 KB default; you can tweak this
  });

  // 🔹 res is a writable stream that represents the HTTP response body.
  // 🔹 `readStream.pipe(res)` automatically reads chunks from the file,
  //    and writes each chunk directly to the response as it's read.
  readStream.pipe(res);

  // Log each chunk size as it arrives (server side)
  readStream.on('data', (chunk) => {
    // console.log(`📤 Sending chunk of size: ${chunk.length} bytes`);
  });

  // Handle stream or connection errors
  req.on('error', (err) => {
    console.error('❌ Error sending file:', err);
    res.status(500).send('sending failed.');
  });
};

export default SendingService;
