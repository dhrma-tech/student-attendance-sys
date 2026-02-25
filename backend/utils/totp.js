const crypto = require('crypto');

// The secret key should be stored in your .env file
const SECRET_KEY = process.env.APP_SECRET || 'super_secret_dev_key'; 

const generateRotatingQR = (classId, sessionId) => {
    // Get current time in 10-second blocks (rotates every 10s)
    const timeSlice = Math.floor(Date.now() / 10000); 
    
    // Create a payload combining class, session, and the time block
    const payload = `${classId}:${sessionId}:${timeSlice}`;
    
    // Hash it using HMAC-SHA256
    const hash = crypto.createHmac('sha256', SECRET_KEY)
                       .update(payload)
                       .digest('hex');
                       
    // The actual text the QR code will hold
    return JSON.stringify({ classId, sessionId, hash });
};

const validateScan = (classId, sessionId, scannedHash) => {
    // Check the current 10-second block, and the previous one 
    // (in case they scan exactly as the second ticks over)
    const currentSlice = Math.floor(Date.now() / 10000);
    const prevSlice = currentSlice - 1;

    const validHashCurrent = crypto.createHmac('sha256', SECRET_KEY).update(`${classId}:${sessionId}:${currentSlice}`).digest('hex');
    const validHashPrev = crypto.createHmac('sha256', SECRET_KEY).update(`${classId}:${sessionId}:${prevSlice}`).digest('hex');

    return scannedHash === validHashCurrent || scannedHash === validHashPrev;
};

module.exports = { generateRotatingQR, validateScan };
