FROM golang:1.21 as builder

# Set the working directory inside the build container
WORKDIR /app

# Copy the go modules files
COPY go.mod go.sum ./

# Download and install dependencies
RUN go mod download

# Prune any no-longer-needed dependencies and add missing ones
RUN go mod tidy

# Copy the source code into the build container
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o main .

# Use a minimal alpine image to run our application
# Alpine is chosen for its small size and security profile
FROM alpine:latest  

# Add a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory in the runtime container
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/main .

# Copy .env file if required for environment variables
COPY --from=builder /app/.env ./

# Ensure the application runs as the non-root user
USER appuser

# Expose the port the application runs on
EXPOSE 3000

# Command to run the application
CMD ["./main"]