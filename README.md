# ClinicFlow - Patient Acquisition Automation System

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Platform-Web-brightgreen.svg" alt="Platform">
</p>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Technology Stack](#technology-stack)
- [Support](#support)

---

## About

**ClinicFlow** is a comprehensive Patient Acquisition & Retention System designed for modern clinics. It transforms manual patient follow-up into an automated revenue engine with instant responses, smart booking, and powerful analytics.

---

## Features

✅ **Multi-Channel Lead Capture** - Website, WhatsApp, Facebook, Phone  
✅ **Instant Auto-Response** - Respond within 60 seconds  
✅ **Smart Qualification Flow** - Filter high-quality leads  
✅ **Automated Appointment Booking** - Calendar integration  
✅ **No-Show Reduction** - 48h, 24h, same-day reminders  
✅ **Patient Reactivation** - Win back inactive patients  
✅ **Performance Dashboard** - Real-time analytics  

---

## Quick Start

### Option 1: Open Directly in Browser
```
Simply double-click index.html
```

### Option 2: Local Server (Recommended)
```
bash
# Install dependencies
npm install

# Start server
npm start
# Then open http://localhost:3000
```

### Option 3: Python Server
```
bash
# Python 3
python -m http.server 3000

# Then open http://localhost:3000
```

### Option 4: VSCode
1. Install "Live Server" extension
2. Right-click index.html → "Open with Live Server"

---

## Demo Credentials

```
Email:    admin@clinic.com
Password: admin123
```

---

## Project Structure

```
MVP 1/
├── index.html          # Main application (Dashboard CRM)
├── landing.html        # Marketing landing page
├── server.js           # Node.js local server
├── package.json        # Dependencies
├── README.md           # This file
│
├── css/
│   └── style.css       # Application styles
│
├── js/
│   ├── app.js         # Main application logic
│   └── data.js        # Sample data & config
│
├── Deployment Configs/
│   ├── netlify.toml   # Netlify deployment
│   ├── vercel.json   # Vercel deployment
│   ├── .nojekyll     # GitHub Pages
│   └── _config.yml   # Jekyll config (optional)
│
└── Scripts/
    ├── start.bat      # Windows startup
    └── start.sh      # Mac/Linux startup
```

---

## Deployment

### 🌐 Netlify (Recommended - Free)

1. Push code to GitHub
2. Connect to Netlify
3. Deploy automatically

```
bash
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

### ▲ Vercel (Free)

```
bash
npm install -g vercel-cli
vercel --prod
```

### 📦 GitHub Pages (Free)

1. Go to Settings → Pages
2. Select "main" branch
3. Your site will be live at: `username.github.io/MVP 1`

### ☁️ Heroku

```
bash
heroku create clinicflow-app
git push heroku main
```

### 🖥️ Traditional Hosting

Upload all files to your web server's public_html directory.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Charts | Chart.js |
| Icons | Font Awesome 6 |
| Fonts | Inter, Poppins |
| Server | Node.js Express |

---

## File Paths Reference

| File | Purpose | URL Path |
|------|---------|----------|
| `index.html` | Main App | `/` or `/index.html` |
| `landing.html` | Landing Page | `/landing.html` |
| `css/style.css` | Styles | `/css/style.css` |
| `js/app.js` | Application | `/js/app.js` |
| `js/data.js` | Data | `/js/data.js` |

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Support

📧 **Email:** support@clinicflow.com  
📞 **Phone:** +1 (555) 123-4567  
🌐 **Website:** https://clinicflow.com

---

## License

MIT License - See LICENSE file for details.

---

<p align="center">Built with ❤️ by ClinicFlow Team</p>
