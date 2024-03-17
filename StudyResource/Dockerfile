FROM python:3-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file
COPY requirements.txt ./

# Install dependencies
RUN python -m pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Set environment variables from .env file
COPY .env ./

# Expose the port your application runs on (if applicable)
EXPOSE 8000

# Set the entry point
CMD ["python", "app.py"]