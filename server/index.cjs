const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// B2 Configuration via S3 API
const s3 = new AWS.S3({
    endpoint: process.env.B2_ENDPOINT,
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
    signatureVersion: 'v4',
    region: process.env.B2_REGION
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.B2_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            const fileName = Date.now().toString() + '-' + file.originalname;
            cb(null, `uploads/${fileName}`);
        }
    })
});

// Upload Endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({
            message: 'Successfully uploaded',
            url: req.file.location,
            key: req.file.key
        });
    } else {
        res.status(400).json({ error: 'Upload failed' });
    }
});

// Proxy to avoid CORS for reading files if needed
app.get('/proxy-image', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL is required');
    
    try {
        const axios = require('axios');
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching image');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`B2 Proxy Server running on port ${PORT}`);
});
