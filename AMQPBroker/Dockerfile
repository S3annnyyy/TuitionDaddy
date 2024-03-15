FROM python:3-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the requirements.txt file into the container
COPY requirements.txt ./

# Install Python dependencies
RUN python -m pip install --no-cache-dir -r requirements.txt

# Copy all files from the current directory into the container
COPY . .

# Set environment variables from .env file
COPY .env ./

# Set up any other necessary configurations or dependencies

# Expose any necessary ports (if needed)
# EXPOSE <port>

# Define the command to run your notification microservice
CMD [ "python", "amqp_setup.py" ]
