# Use the official Node.js v20.11.0 image as the base
FROM node:20.11.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies using pnpm
RUN pnpm install

# Copy the entire project directory to the working directory
COPY . .

# Set environment variables from .env file
COPY .env ./

# Expose the port your application runs on (default is 5173 for Vite)
EXPOSE 5173

# Start the application with pnpm run dev
CMD ["pnpm", "run", "dev"]