# frontend/Dockerfile
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production version
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the production build using a lightweight HTTP server
CMD ["npx", "serve", "-s", "build"]
