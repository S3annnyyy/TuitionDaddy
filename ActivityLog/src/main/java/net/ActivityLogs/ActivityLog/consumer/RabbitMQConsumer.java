package net.ActivityLogs.ActivityLog.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RabbitMQConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitMQConsumer.class);

    @RabbitListener(queues = { "${activitylog.rabbitmq.queue.name}" })
    public void consume(String msg) {
        // logger.info("Received Message: " + msg);
        LOGGER.info(String.format("Received Message: %s", msg));
        
    }
}
