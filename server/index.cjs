require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Shippo } = require('shippo');

if (!process.env.SHIPPO_API_KEY) {
    console.error("❌ CRITICAL: SHIPPO_API_KEY is not defined in .env");
}

const shippo = new Shippo({ 
    apiKeyHeader: process.env.SHIPPO_API_KEY || '' 
});
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add error logging for all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// File-based Persistence
const dataDir = './data';
const fs = require('fs');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const loadData = (filename, defaultValue) => {
    const path = `${dataDir}/${filename}`;
    if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    return defaultValue;
};

const saveData = (filename, data) => {
    fs.writeFileSync(`${dataDir}/${filename}`, JSON.stringify(data, null, 2));
};

let messages = loadData('messages.json', []);
let orders = loadData('orders.json', []);

// B2 Configuration via S3 API
const s3 = new AWS.S3({
    endpoint: process.env.B2_ENDPOINT,
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
    signatureVersion: 'v4',
    region: process.env.B2_REGION
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// --- B2 IMAGE UPLOAD PROXY ---
// The following route handles uploading to Backblaze B2 via S3 API


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

// --- PRODUCTS API ---
// --- B2 IMAGE UPLOAD PROXY ---
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se proporcionó ninguna imagen" });
    }

    try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `${Date.now()}-${req.file.originalname}`;
        
        const params = {
            Bucket: process.env.B2_BUCKET_NAME,
            Key: `products/${fileName}`,
            Body: fileContent,
            ContentType: req.file.mimetype
        };

        const uploadResult = await s3.upload(params).promise();
        
        // Clean up local file
        fs.unlinkSync(req.file.path);
        
        console.log("✅ Imagen subida a B2:", uploadResult.Location);
        res.json({ url: uploadResult.Location });
    } catch (error) {
        console.error("❌ Error subiendo a B2:", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: "Error al subir la imagen a B2" });
    }
});

// --- MESSAGES API ---
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

app.post('/api/messages', (req, res) => {
    const newMessage = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString().split('T')[0]
    };
    messages.push(newMessage);
    saveData('messages.json', messages);
    res.status(201).json(newMessage);
});

// --- ORDERS API ---
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: `ORD-${Date.now().toString().slice(-4)}`,
        ...req.body,
        status: 'Pendiente',
        date: new Date().toISOString().split('T')[0]
    };
    orders.push(newOrder);
    saveData('orders.json', orders);
    res.status(201).json(newOrder);
});

// --- SHIPPO SHIPPING API ---
// --- INTERNAL USPS 2026 SHIPPING MOTOR (NO API) ---
// Origin: New York / New Jersey (Zones calculated from Zip 10001)
const calculateUSPSRate = (zip, weightLbs = 0.5) => {
    // 1. Determine Zone based on first digit of Zip Code (Simplified Zone Map for NY/NJ)
    // 0-1: Zone 1-2 (Northeast)
    // 2-3: Zone 3-4 (East Coast / Midwest)
    // 4-6: Zone 5-6 (South / Central)
    // 7-9: Zone 7-8 (West Coast)
    const firstDigit = parseInt(zip.charAt(0));
    let zone = 1;
    if (firstDigit <= 1) zone = 2;
    else if (firstDigit <= 3) zone = 4;
    else if (firstDigit <= 6) zone = 6;
    else zone = 8;

    // 2. USPS Ground Advantage 2026 Estimated Commercial Rates
    // Simple table: [Weight Up To Lbs]: { Zone1-2, Zone3-4, Zone5-6, Zone7-8 }
    const ratesTable = {
        0.5: { 2: 5.40, 4: 5.80, 6: 6.20, 8: 6.80 },
        1.0: { 2: 6.80, 4: 7.50, 6: 8.20, 8: 9.40 },
        2.0: { 2: 8.50, 4: 9.80, 6: 12.40, 8: 15.20 },
        5.0: { 2: 12.50, 4: 15.20, 6: 22.40, 8: 28.50 }
    };

    // Find applicable row
    const weightKeys = Object.keys(ratesTable).map(Number).sort((a,b) => a-b);
    const applicableWeight = weightKeys.find(w => w >= weightLbs) || 5.0;
    const basePrice = ratesTable[applicableWeight][zone];

    return [
        {
            id: 'usps-ground',
            provider: 'USPS',
            service: 'Ground Advantage (2026)',
            price: basePrice,
            days: zone <= 2 ? 2 : zone <= 4 ? 3 : 5
        },
        {
            id: 'usps-priority',
            provider: 'USPS',
            service: 'Priority Mail',
            price: basePrice + 4.50, // Simplified Priority Add-on
            days: zone <= 4 ? 2 : 3
        }
    ];
};

app.post('/api/shipping/rates', async (req, res) => {
    try {
        const { address, city, state, zip, items } = req.body;
        console.log(`Calculando envío interno para Zip: ${zip} desde NY/NJ`);

        // Calculate total weight (defaulting to 0.5 if not provided)
        let totalWeight = 0;
        if (items && items.length > 0) {
            totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0.5) * (item.quantity || 1), 0);
        } else {
            totalWeight = 0.5;
        }

        const rates = calculateUSPSRate(zip, totalWeight);

        res.json({
            rates,
            correctedAddress: { address, city, state, zip } // Echo back as valid
        });
    } catch (error) {
        console.error("Error motor interno:", error);
        res.status(500).json({ error: "No se pudo calcular el envío" });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("--- Global Error Handler ---");
    console.error(err);
    res.status(err.status || 500).json({
        error: "Error en el servidor",
        details: err.message,
        code: err.code
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`B2 Proxy Server running on port ${PORT}`);
});
