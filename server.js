// ⚠️ Pi Developer Portal'dan aldığın gizli anahtarı buraya tırnakların içine yapıştır:
const PI_API_KEY = "BURAYA_PORTAL_ALINAN_KEYI_YAZIN";

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Tüm kaynaklardan gelen isteklere (Frontend'e) izin veriyoruz
app.use(cors());
app.use(express.json());

// Pi Network API temel adresi
const PI_API_URL = 'https://api.minepi.com/v2';

// 1. Adım: Ödeme Onaylama (Approve) Uç Noktası
app.post('/api/approve-payment', async (req, res) => {
    const { paymentId } = req.body;
    
    if (!paymentId) {
        return res.status(400).json({ error: "paymentId eksik!" });
    }

    try {
        // Resmi Pi Sunucusuna "Ben bu ödemeyi onaylıyorum" sinyali gönderiyoruz
        const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/approve`, {}, {
            headers: {
                'Authorization': `Key ${PI_API_KEY}`
            }
        });
        
        console.log(`Ödeme ${paymentId} başarıyla onaylandı.`);
        res.json(response.data);
    } catch (error) {
        console.error("Approve hatası:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Ödeme onaylanırken bir hata oluştu." });
    }
});

// 2. Adım: Ödeme Tamamlama (Complete) Uç Noktası
app.post('/api/complete-payment', async (req, res) => {
    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {
        return res.status(400).json({ error: "paymentId veya txid eksik!" });
    }

    try {
        // Resmi Pi Sunucusuna blockchain işlem numarasını (txid) bildirip ödemeyi kapatıyoruz
        const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, {
            txid: txid
        }, {
            headers: {
                'Authorization': `Key ${PI_API_KEY}`
            }
        });

        console.log(`Ödeme ${paymentId} başarıyla tamamlandı ve kapatıldı.`);
        res.json(response.data);
    } catch (error) {
        console.error("Complete hatası:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Ödeme tamamlanırken bir hata oluştu." });
    }
});

// Sunucunun çalışacağı port ayarı (Render otomatik atar)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Pi Trust Backend sunucusu ${PORT} portunda başarıyla çalışıyor.`);
});
