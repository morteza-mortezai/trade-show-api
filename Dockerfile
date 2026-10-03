# ---------- Build stage ----------
    FROM node:24-alpine AS builder

    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm ci
    
    # Copy source
    COPY . .
    
    # Build NestJS application
    RUN npm run build
    
    
    # ---------- Production stage ----------
    FROM node:24-alpine AS production
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # Install only production dependencies
    COPY package*.json ./
    RUN npm ci --omit=dev && npm cache clean --force
    
    # Copy compiled application
    COPY --from=builder /app/dist ./dist
    
    # Copy MikroORM config if needed at runtime
    COPY --from=builder /app/src/config ./src/config
    
    # Copy existing SQLite database
    COPY expense-sharing.db ./expense-sharing.db
    
    EXPOSE 3000
    
    CMD ["node", "dist/main.js"]