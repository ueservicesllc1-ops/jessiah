const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Shippo } = require('shippo');
const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Temporary In-Memory Storage (Ideally use a DB like MongoDB or Firebase)
let messages = [];

let orders = [];

let products = [];

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

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const newProduct = {
        id: Date.now(),
        ...req.body,
        price: parseFloat(req.body.price)
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.status(204).send();
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
    res.status(201).json(newOrder);
});

// --- SHIPPO SHIPPING API ---
app.post('/api/shipping/rates', async (req, res) => {
    try {
        const { address, city, state, zip } = req.body;

        const shipment = await shippo.shipments.create({
            addressFrom: {
                name: "Jessiah Hair Line",
                street1: "123 Business St",
                city: "Miami",
                state: "FL",
                zip: "33101",
                country: "US"
            },
            addressTo: {
                name: "Cliente",
                street1: address,
                city: city,
                state: state,
                zip: zip,
                country: "US"
            },
            parcels: [{
                length: "10",
                width: "7",
                height: "4",
                distanceUnit: "in",
                weight: "2",
                massUnit: "lb"
            }],
            async: false
        });

        console.log(`Shippo devolvió ${shipment.rates.length} tarifas.`);
        
        // Map and sort rates (fastest and cheapest first)
        const rates = shipment.rates
            .map(rate => {
                console.log(`- ${rate.provider} ${rate.servicelevel.name}: $${rate.amount} (${rate.estimatedDays} días)`);
                return {
                    id: rate.objectId,
                    provider: rate.provider,
                    service: rate.servicelevel.name,
                    price: parseFloat(rate.amount),
                    days: rate.estimatedDays || (rate.servicelevel.token.toLowerCase().includes('priority') || rate.servicelevel.token.toLowerCase().includes('expedited') ? 2 : 5)
                };
            })
            .sort((a, b) => a.price - b.price);

        res.json(rates);
    } catch (error) {
        console.error("Error detallado de Shippo:", error);
        res.status(500).json({ 
            error: "No se pudieron obtener las tarifas de envío",
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`B2 Proxy Server running on port ${PORT}`);
});
