# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/config ./packages/config
COPY packages/database ./packages/database
COPY apps/api ./apps/api

# Build database package
WORKDIR /app/packages/database
RUN pnpm prisma generate
RUN pnpm build

# Build API
WORKDIR /app/apps/api
RUN pnpm build

# Production stage
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY apps/api/package.json ./apps/api/

# Install production dependencies only (skip prepare scripts)
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy built files from builder
COPY --from=builder /app/packages/config ./packages/config
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/packages/database/node_modules/.prisma ./packages/database/node_modules/.prisma
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Generate Prisma Client in production
WORKDIR /app/packages/database
RUN npx prisma generate

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/main.js"]

