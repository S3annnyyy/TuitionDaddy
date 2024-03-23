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
EXPOSE 5100

# Run the Flask application and the notification consumer
CMD ["sh", "-c", "python app.py & python notification.py & python webhook.py"]