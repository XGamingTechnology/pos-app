# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Salin package files
COPY package*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Salin seluruh kode
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Install hanya dependencies production
COPY package*.json ./
RUN npm ci --production --prefer-offline --no-audit

# Salin hasil build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Opsional: salin file statis lain jika ada
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.env.local ./.env.local

# Buat non-root user (opsional tapi aman)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]