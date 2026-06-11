# AI Crypto Advisor — single-service container image.
#
# Stage 1 compiles the React dashboard; stage 2 runs FastAPI, which serves
# frontend/dist at "/" (server/main.py prefers it over the legacy web/ UI).

FROM node:22-slim AS frontend
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM python:3.11-slim AS runtime

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
COPY --from=frontend /build/dist ./frontend/dist

# Render (and most PaaS) inject the port via $PORT. Default to 8000 locally.
ENV PORT=8000
EXPOSE 8000

# Shell form so $PORT is expanded at runtime.
CMD uvicorn server.main:app --host 0.0.0.0 --port ${PORT:-8000}
