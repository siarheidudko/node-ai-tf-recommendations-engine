# Use Node.js 22 as the base image
FROM node:22.13.1 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose the application port
EXPOSE 8013

# Start the application using pm2-docker
CMD ["node", "--experimental-strip-types","--expose-gc", "--max-old-space-size=2048", "./src/server.ts"]
