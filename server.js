// server.js - Node.js Backend Kodu
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Pi Developer Portal'dan aldığınız anahtarı buraya yazın
const PI_API_KEY = "BURAYA_PI_DEVELOPER_PORTAL_API_KEYINIZI_YAZIN"; 
const PI_API_URL = "https://api.minepi.com/v2";

// 1. Ödeme Onaylama (Approve) Uç Noktası
app.post('/api/payments/approve', async (req, res) => {
    const { paymentId } = req.body;
    try {
        const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/approve`, {}, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Approve Hatası:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Ödeme Tamamlama (Complete) Uç Noktası
app.post('/api/payments/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    try {
        const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, { txid }, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Complete Hatası:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Pi dApp Backend ${PORT} portunda çalışıyor...`));
