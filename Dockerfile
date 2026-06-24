# ── Stage 1: build React frontend ──────────────────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npx vite build

# ── Stage 2: Python backend + bundled frontend ──────────────────────────────
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Copy the built React app to be served by Flask
COPY --from=frontend-build /frontend/dist ./static

RUN mkdir -p uploads

EXPOSE 5050

# gunicorn with eventlet worker for WebSocket (Flask-SocketIO) support
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", \
     "--bind", "0.0.0.0:5050", \
     "--timeout", "120", \
     "app:app"]
