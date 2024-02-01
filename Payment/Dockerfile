# Use the official Go image as the base image
FROM golang:1.21

# Set the working directory inside the container
WORKDIR /

# Copy the go modules files
COPY go.mod go.sum ./

# Download and install dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go application
RUN go build -o main .

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application
CMD ["./main"]
