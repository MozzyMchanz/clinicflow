// ========================================
// ClinicFlow - Local Development Server
// ========================================

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('========================================');
    console.log('  ClinicFlow Server Running');
    console.log('========================================');
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Open in your browser to view the app`);
    console.log('========================================');
    console.log('');
    console.log('Demo Login Credentials:');
    console.log('  Email:    admin@clinic.com');
    console.log('  Password: admin123');
    console.log('========================================');
});
