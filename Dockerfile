# Build
FROM node:18-slim AS backend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production
FROM node:18-slim AS backend-image
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=backend-build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/app/app.js"]