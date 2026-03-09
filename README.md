# ✦ MODEXAI – Fashion Trends Intelligence System

An AI-powered fashion trend analysis and prediction platform built for ecommerce applications.

![Fashion AI](https://img.shields.io/badge/AI-Powered-FF3D6B?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Claude](https://img.shields.io/badge/Claude-Sonnet-8B5CF6?style=for-the-badge)

## 🚀 Live Demo
[![Run on Replit](https://replit.com/badge/github/Kusumar95/Fashion-Trends-AI)](https://replit.com/new/github/Kusumar95/Fashion-Trends-AI)

---

## ✨ Features

### 📊 Dashboard
- Live KPIs: trend scores, demand forecast, conversion lift
- Trend rankings with velocity bars & momentum indicators
- Weekly performance charts
- Customer segment donut chart (Gen Z, Millennials, Luxury, Budget)
- Quick-insight shortcuts powered by AI

### 📈 Trend Analysis
- Filter by 6 categories: Womenswear, Menswear, Streetwear, Luxury, Athleisure, Accessories
- Trend cards with scores, MoM momentum, and social buzz
- Full velocity matrix: search volume, social buzz, buy intent
- One-click AI deep dive per trend

### 🤖 AI Predict Engine
- Select season, region & category filters
- Claude-powered trend forecasting
- Outputs: top trend, confidence score, revenue impact, key drivers, recommended actions, target segment, risk factors

### 👗 Product Intelligence
- Trend-linked product catalog
- Demand bars, stock levels, low-stock alerts
- One-click AI restock analysis

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **AI**: Claude Sonnet (Anthropic API)
- **Styling**: Pure CSS-in-JS with custom design system
- **Charts**: Custom SVG visualizations

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🔑 API Key Setup

This app uses the Anthropic API. The API key is handled via the Claude.ai artifact proxy.

For standalone deployment, set your key in the fetch headers in `src/App.jsx`.

---

## 📁 Project Structure

```
fashion-trends-ai/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx        # Main application
```

---

## 🎨 Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0A0A0F` | App background |
| Accent | `#FF3D6B` | Primary CTA, highlights |
| Teal | `#00D4B1` | Positive trends |
| Gold | `#FFB547` | Luxury, predictions |
| Purple | `#8B5CF6` | Segments, analytics |

---

Built with ❤️ using Claude AI + React
