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

# Import env variables directly into the container
# ENV MONGO_URI=mongodb+srv://tayoefunshile:ZdlAAiXvjGhIqss0@eventappdb.9alol.mongodb.net/?retryWrites=true&w=majority&appName=eventappdb
# ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
