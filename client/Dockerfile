FROM node:18-alpine

WORKDIR /app

# Copy and install dependencies
COPY client/package*.json ./
RUN npm ci --only=production

# Copy application
COPY client/src ./src
COPY client/*.* ./

# Build application
RUN npm run build

# Serve built files
EXPOSE 5173
CMD ["npm", "run", "preview"]
