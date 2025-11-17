# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web
COPY packages/database ./packages/database

# Generate Prisma Client
WORKDIR /app/packages/database
RUN pnpm prisma generate

# Build Next.js app
WORKDIR /app/apps/web
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set NODE_ENV before installing to skip prepare scripts
ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

# Install production dependencies only (--ignore-scripts to skip husky)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copy Prisma schema and generate client
COPY packages/database/prisma ./packages/database/prisma
WORKDIR /app/packages/database
RUN pnpm prisma generate

# Copy built app from builder
WORKDIR /app
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/next.config.mjs ./apps/web/

# Set port
ENV PORT=3000

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["pnpm", "start"]

