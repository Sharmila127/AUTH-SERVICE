# Use official Node.js LTS image (lightweight Alpine version)
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the port your app listens on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
