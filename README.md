# SwissSafe - Product Legality Checker

An AI-powered web application that checks if products from TEMU or SHEIN are legal for sale or import in Switzerland.

## 🚀 Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4 to analyze product URLs and determine legality
- **Modern Web UI**: Built with NextJS and Tailwind CSS for a beautiful, responsive interface
- **Fast API Backend**: Python FastAPI backend with CORS support
- **Docker Support**: Fully containerized for easy deployment
- **Real-time Results**: Instant feedback with confidence levels and detailed reasoning

## 🏗️ Architecture

- **Frontend**: NextJS 14 with TypeScript and Tailwind CSS
- **Backend**: Python FastAPI with OpenAI integration
- **AI Model**: OpenAI GPT-4 for product analysis
- **Containerization**: Docker and Docker Compose

## 📋 Prerequisites

- Docker and Docker Compose
- OpenAI API key (included in the project)

## 🚀 Quick Start

1. **Navigate to the project directory**:
   ```bash
   cd /Users/simonz666/Desktop/ETHZ/3_Semester/SwissAIHack2025/SwissSafe
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### POST /check-product
Check if a product is legal for sale/import in Switzerland.

**Request Body**:
```json
{
  "url": "https://www.temu.com/product-url"
}
```

**Response**:
```json
{
  "status": "Legal|Uncertain|Illegal",
  "reasoning": "Detailed explanation of the decision",
  "confidence": 0.85
}
```

### GET /health
Health check endpoint.

## 🎯 Usage

1. Open the web application at http://localhost:3000
2. Enter a product URL from TEMU or SHEIN
3. Click "Check Product Legality"
4. View the AI analysis with status, confidence level, and reasoning

## 🧠 AI Analysis

The system analyzes products based on:
- Product type and category
- Swiss import restrictions
- Safety regulations
- Prohibited items (e.g., class 2+ laser pointers)
- Age restrictions
- Chemical/biological restrictions

## ⚠️ Disclaimer

This analysis is based on AI interpretation of Swiss regulations. Always consult official sources and legal experts for definitive guidance on product legality.

## 📄 License

MIT License - Built for Swiss AI Hackathon 2025

## 🤝 Contributing

This project was created for the Swiss AI Hackathon 2025 challenge "Don't walk straight into the trap (Gov3)".

## 🏆 Hackathon Challenge

**Problem**: Prevent users from buying products that are prohibited for sale in or import to Switzerland.

**Solution**: AI-based tool that instantly checks the legality of e-commerce products using product identification numbers from major platforms like TEMU or SHEIN.

**Impact**: 
- Help customers avoid accidental illegal activities
- Use AI to make Switzerland a safer place
- Provide instant compliance checking for online shoppers
