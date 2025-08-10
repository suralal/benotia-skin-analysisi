# Benotia - AI-Powered Skin Analysis Platform

This project combines a FastAPI backend for skin analysis with a React frontend for user interaction.

## Project Structure

```
Benotia/
├── backend/                   # Backend (FastAPI)
│   ├── app/                   # FastAPI application
│   ├── engine/                # Skin analysis algorithms
│   ├── models/                # AI models and configurations
│   └── requirements.txt       # Python dependencies
│
├── analysis-app/              # Frontend (React)
│   ├── components/            # React components
│   ├── utils/                 # Utility functions
│   ├── package.json           # Node.js dependencies
│   └── README.md             # Frontend documentation
│
└── website-app/               # Website (Next.js)
    ├── components/            # Next.js components
    ├── src/                   # Source code
    ├── package.json           # Node.js dependencies
    └── README.md             # Website documentation
```

## Quick Start

### Option 1: Use the Startup Script (Recommended)
```bash
./start_services.sh
```

### Option 2: Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On macOS/Linux
   # or
   .venv\Scripts\activate     # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd analysis-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Real-time Face Detection**: Uses TensorFlow.js for facial landmark detection
- **AI-Powered Skin Analysis**: Detects acne, pigmentation, wrinkles, and more
- **Region-Specific Analysis**: Analyzes different facial areas separately
- **Visual Overlays**: Generates annotated images showing detected concerns
- **Comprehensive Scoring**: Provides detailed scores and recommendations

## API Endpoints

- `POST /v1/analysis` - Submit skin analysis job
- `GET /v1/analysis/{job_id}` - Get analysis results

## Technologies Used

- **Backend**: FastAPI, OpenCV, NumPy, ONNX Runtime
- **Frontend**: React, TypeScript, TensorFlow.js, Tailwind CSS
- **AI Models**: YOLOv8 for acne detection, custom algorithms for other concerns

## Troubleshooting

- If you get port conflicts, make sure no other services are running on ports 8000 or 3000
- For backend issues, check the virtual environment is activated
- For frontend issues, ensure Node.js dependencies are installed
