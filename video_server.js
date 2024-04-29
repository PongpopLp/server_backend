const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3500; // Set your desired port number

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Endpoint to handle file upload
app.post('/upload', upload.single('video'), (req, res) => {
  // Uploaded file details
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // File upload successful
  res.send('File uploaded successfully.');
});

// Serve uploaded files statically
// app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'uploads')));
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
