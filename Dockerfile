# Stage 1: Build Next.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Schema
COPY prisma ./prisma
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production with Python
FROM node:20-alpine AS runner
WORKDIR /app

# Install Python
RUN apk add --no-cache python3 py3-pip

# Copy Python requirements and install dependencies
COPY scripts/requirements.txt ./scripts/requirements.txt
RUN pip3 install --break-system-packages --no-cache-dir -r ./scripts/requirements.txt

# Copy Python scripts
COPY scripts/ ./scripts/

# Copy the generated_images folder with existing images
COPY generated_images/ ./generated_images/

# Copy Next.js build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Copy and set up startup script
COPY start.sh ./
RUN chmod +x start.sh

ENV NODE_ENV=production
EXPOSE 3000 8000

CMD ["./start.sh"]