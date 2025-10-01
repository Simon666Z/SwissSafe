# SwissSafe - Product Legality Checker

An AI-powered web application that checks if products from TEMU or SHEIN are legal for import into Switzerland.

## Features

**AI-Powered Analysis**: Uses Swiss AI Platform Apertus 70B model to analyze product URLs and determine legality

**Modern Web UI**: Built with NextJS and Tailwind CSS for a beautiful, responsive interface

**Fast API Backend**: Python FastAPI backend with CORS support

**Docker Support**: Fully containerized for easy deployment

**Real-time Results**: Instant feedback with confidence levels and detailed reasoning

**Chrome Extension**: Browser extension for quick product checking while shopping

## Architecture

**Frontend**: NextJS 14 with TypeScript and Tailwind CSS

**Backend**: Python FastAPI with Swiss AI Platform Apertus integration

**AI Model**: Swiss AI Platform Apertus 70B for product analysis

**Containerization**: Docker and Docker Compose

**Browser Extension**: Chrome extension with Manifest V3

## Prerequisites

- Docker and Docker Compose
- Apertus LLM API key
- Node.js 18+
- Python 3.11+

## Quick Start

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Simon666Z/SwissSafe.git
   cd SwissSafe
   ```

2. **Set up your LLM API key** (can change to other llm api in backend/main.py):
   ```bash
   export SWISS_AI_PLATFORM_API_KEY="your_apertus_api_key" 
   ```

3. **Start the application**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Development

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

### Chrome Extension Development
```bash
cd chrome-extension
# Load the extension in Chrome developer mode
# Point to the chrome-extension folder
```

## API Endpoints

POST /check-product:

Check if a product is legal for sale/import in Switzerland.

Request Body:
```json
{
  "url": "https://www.temu.com/product-url"
}
```

Response:
```json
{
  "status": "legal|possibly legal|possibly illegal|illegal|likely legal|likely illegal",
  "reasoning": "Detailed explanation of the decision",
  "confidence": 0.85
}
```

GET /health:

Health check endpoint.

## Usage

1. Open the web application at http://localhost:3000
2. Enter a product URL from TEMU or SHEIN
3. Click "Check Product Legality"
4. View the AI analysis with status, confidence level, and reasoning

### Chrome Extension Usage
1. Install the Chrome extension from the chrome-extension folder
2. Click the SwissSafe icon while browsing e-commerce sites
3. Right-click any product link and select "Check with SwissSafe"

## Project Structure

```
SwissSafe/
├── backend/           # FastAPI backend server
├── frontend/          # NextJS web application
├── chrome-extension/  # Chrome browser extension
├── wallpapers/       # Swiss-themed background images
├── docker-compose.yml # Container orchestration
└── README.md         # This file
```

## Team

This project was developed by a team of computer science students at ETH Zürich for the Swiss AI Hackathon 2025.

## Disclaimer

This analysis is based on AI interpretation of Swiss regulations. Always consult official sources and legal experts for definitive guidance on product legality. We're students, not legal professionals!

## License

MIT License - Built for Swiss AI Hackathon 2025

## Hackathon Challenge

**Problem**: Help users check the legality of products from online shopping websites to be imported to Switzerland.

**Solution**: AI-based tool that instantly checks the legality of e-commerce products using product identification numbers from major platforms like TEMU or SHEIN.

**Impact**: 
- Help customers avoid accidental illegal activities
- Use AI to make Switzerland a safer place
- Provide instant compliance checking for online shoppers

## Contributing

This project was created for the Swiss AI Hackathon 2025 challenge "Don't walk straight into the trap (Gov3)".

## Acknowledgments

Thanks to Swiss AI week for the opportunity and providing API Key; thanks to Swiss gov expert who guided and supported us through the hackathon project!!