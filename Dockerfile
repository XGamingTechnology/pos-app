# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Salin package files
COPY package*.json ./

# Install semua dependencies (termasuk dev) untuk build
RUN npm ci

# Salin kode
COPY . .

# Build Next.js app
RUN npm run build