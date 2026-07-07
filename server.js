const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Phát file HTML và ảnh cho người dùng truy cập
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Kết nối Cơ sở dữ liệu MongoDB
const MONGO_URI = 'mongodb+srv://manhchinh8024:23068000@cluster0.qhxg4vc.mongodb.net/ky_nguyen_moi?appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Đã kết nối thành công với Cơ sở dữ liệu!'))
    .catch(err => console.error('Lỗi kết nối cơ sở dữ liệu:', err));

const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    note: String,
    chosenDate: String,
    chosenTime: String,
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

app.get('/api/bookings', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.json([]);
        const bookings = await Booking.find({ chosenDate: date });
        const bookedTimes = bookings.map(b => b.chosenTime);
        res.status(200).json(bookedTimes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const { name, phone, note, chosenDate, chosenTime } = req.body;
        const newBooking = new Booking({ name, phone, note, chosenDate, chosenTime });
        await newBooking.save();
        res.status(201).json({ message: 'Đặt lịch thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Máy chủ đang chạy tại cổng: ${PORT}`);
});
