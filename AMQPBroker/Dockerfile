# Use RabbitMQ image with management plugin
FROM rabbitmq:3-management

# Set hostname
ENV HOSTNAME="localhost"

# Expose ports
EXPOSE 5672 15672

# Copy configuration files
COPY rabbitmq.config /etc/rabbitmq/rabbitmq.config
COPY rabbitmq_definitions.json /etc/rabbitmq/rabbitmq_definitions.json

# Define volumes
VOLUME ["/var/lib/rabbitmq"]

# Restart policy
CMD ["rabbitmq-server"]
