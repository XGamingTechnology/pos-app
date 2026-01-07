# ---------- BUILD ----------
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- RUN ----------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# 👉 INI YANG PALING PENTING
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# ✅ TAMBAHKAN INI — supaya .env.local dibaca di runtime
COPY .env.local .env.local


EXPOSE 3000
CMD ["node", "server.js"]

