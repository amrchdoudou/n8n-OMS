// server.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const UploadService = async (req, res) => {
    let SaveFolderPath = 'uploads/';
    const fileExtension = req.headers['file-name'];
    //
    if (!fileExtension) {
        res.status(400).send('File name header is missing.');
        return;
    }
    // if (fileExtension === 'mp4' || fileExtension === 'mov' || fileExtension === 'avi') {
    //   SaveFolderPath = 'videoUploads/';
    // }
    if (!fs.existsSync(SaveFolderPath)) {
        fs.mkdirSync(SaveFolderPath);
    }
    const fileName = uuidv4() + '.' + fileExtension;
    const filePath = path.join(SaveFolderPath, fileName);
    // Create a writable stream for saving the uploaded file
    const writeStream = fs.createWriteStream(filePath);
    // 🔹 req is a readable stream that represents the HTTP request body.
    // 🔹 As chunks of data arrive from the TCP socket, Node emits 'data' events on req.
    // 🔹 `req.pipe(writeStream)` automatically listens for 'data' and 'end' events,
    //    writing each chunk directly to disk as it arrives.
    req.pipe(writeStream);
    // Log each chunk size as it arrives (server side)
    req.on('data', (chunk) => {
        console.log(`📥 Received chunk of size: ${chunk.length} bytes`);
    });
    // When the entire upload has finished streaming
    req.on('end', () => {
        console.log('✅ File upload complete.');
        res.json({
            success: true,
            message: 'Upload successful!',
            filePath: filePath, // Return the path so client can use it
        });
    });
    // Handle stream or connection errors
    req.on('error', (err) => {
        console.error('❌ Error receiving file:', err);
        res.status(500).send('Upload failed.');
    });
};
export default UploadService;
//# sourceMappingURL=fileUploadService.js.map