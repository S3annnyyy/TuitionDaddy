# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies
COPY src/package.json src/bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the source directory into the image
COPY src/ ./src

# Copy other necessary files such as your .env file if needed at runtime
# Make sure to add .env to your .dockerignore if it contains sensitive information
# You might want to use environment variables in Kubernetes deployment instead
# COPY .env .

# Build your TypeScript app if there is a build step required
# Replace 'bun build' with the actual build command for your project
# RUN bun build

# Expose the port your app runs on
EXPOSE 3000

# Define the user to run your app
USER bun

# Set the NODE_ENV environment variable if necessary
# ENV NODE_ENV production

# Start the app
ENTRYPOINT [ "bun", "run", "src/server.ts" ]
