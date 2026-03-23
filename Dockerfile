# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies first (better caching)
COPY package.json package-lock.json ./
RUN npm install

# 4. Copy rest of code
COPY . .

# 5. Build Vite app
RUN npm run build

# 6. Expose port
EXPOSE 3000

# 7. Start app
CMD ["npm", "run", "start"]