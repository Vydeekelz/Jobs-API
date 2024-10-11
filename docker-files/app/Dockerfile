# Build stage
FROM node:14 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Production stage
FROM node:14-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .


EXPOSE 5000

CMD ["node", "server.js"]
