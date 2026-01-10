# Build
FROM node:18-slim AS backend-build
WORKDIR /server
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production
FROM node:18-slim AS backend-image
WORKDIR /server
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=backend-build /server/dist ./dist
EXPOSE 3000
CMD ["node", "dist/infrastructure/fastify/server.js"]