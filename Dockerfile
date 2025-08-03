# Use official Node.js LTS Alpine image
FROM node:20-alpine
# Set working directory
WORKDIR /app
# Copy dependencies files
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY . .
# Expose port
EXPOSE 3000
# Run TypeScript directly in development (optional: replace with tsx/nodemon if used)
CMD ["npx", "tsx", "src/server.ts"]
