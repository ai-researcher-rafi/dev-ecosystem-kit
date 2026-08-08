### --- Build Stage ---

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present 

### --- Production Stage ---

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production 

### Create secure non-root user

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs 

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist 

USER nextjs 

EXPOSE 3000
CMD ["npm", "start"]