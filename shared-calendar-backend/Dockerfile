# Use Node LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Install Prisma CLI
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 4000

# Start command (can be swapped for nodemon)
CMD ["npm", "run", "dev"]
