# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files into the working directory
COPY package*.json ./

# Install any dependencies, including development dependencies
RUN npm install

# Install nodemon globally for development use
RUN npm install -g nodemon

# Copy your application source code into the working directory
COPY . .

# Make your service's port available outside this container
EXPOSE 3000

# Define the command to run your app, using npm run dev for development
CMD ["npm", "run", "dev"]