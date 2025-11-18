# Dependencies stage - cached separately
FROM node:24-alpine AS deps

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

# Install dependencies - this layer will be cached if package files don't change
RUN pnpm install --frozen-lockfile

# Build stage
FROM node:24-alpine AS builder

# Build arguments for Next.js public env vars
ARG NEXT_PUBLIC_API_URL=https://hemaweb.world/api
ARG NEXT_PUBLIC_APP_NAME=HemaWeb
ARG NEXT_PUBLIC_APP_URL=https://hemaweb.world

# Set as environment variables for build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Increase Node.js memory limit for heavy install/build steps
ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

# Copy node_modules from deps stage (cached!)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules

# Copy source code
COPY apps/web ./apps/web
COPY packages/database ./packages/database

ENV PRISMA_ENGINES_MIRROR=file:/app/node_modules/.pnpm/@prisma+engines@5.22.0/node_modules/@prisma/engines \
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 \
    PRISMA_CLIENT_ENGINE_TYPE=binary

# Generate Prisma Client
WORKDIR /app/packages/database
RUN npx prisma generate

# Build Next.js app
WORKDIR /app/apps/web
RUN pnpm build

# Production stage
FROM node:24-alpine AS runner

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set NODE_ENV before installing to skip prepare scripts
ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

# Copy node_modules from builder (includes Prisma Client)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/packages/database/node_modules ./packages/database/node_modules

# Copy Prisma schema
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Copy built app from builder
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/next.config.mjs ./apps/web/

# Set port
ENV PORT=3000

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["pnpm", "start"]

