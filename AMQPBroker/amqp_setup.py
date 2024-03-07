import time
import pika
from os import environ

# Instead of hardcoding the values, we can also get them from the environ as shown below
hostname = environ.get('HOSTNAME') #localhost
port = environ.get('PORT')         #5672 

exchangename = environ.get('EXCHANGENAME') #order_topic
exchangetype = environ.get('EXCHANGETYPE') #topic

a_queue_name = environ.get('A_QUEUE_NAME') #Activity_Log
e_queue_name = environ.get('E_QUEUE_NAME') #Error
n_queue_name = environ.get('N_QUEUE_NAME') #Notification

#to create a connection to the broker
def create_connection(max_retries=12, retry_interval=5):
    print('amqp_setup:create_connection')
    
    retries = 0
    connection = None
    
    # loop to retry connection upto 12 times with a retry interval of 5 seconds
    while retries < max_retries:
        try:
            print('amqp_setup: Trying connection')
            # connect to the broker and set up a communication channel in the connection
            connection = pika.BlockingConnection(pika.ConnectionParameters
                                (host=hostname, port=port,
                                heartbeat=3600, blocked_connection_timeout=3600)) # these parameters to prolong the expiration time (in seconds) of the connection
                # Note about AMQP connection: various network firewalls, filters, gateways (e.g., SMU VPN on wifi), may hinder the connections;
                # If "pika.exceptions.AMQPConnectionError" happens, may try again after disconnecting the wifi and/or disabling firewalls.
                # If see: Stream connection lost: ConnectionResetError(10054, 'An existing connection was forcibly closed by the remote host', None, 10054, None)
                # - Try: simply re-run the program or refresh the page.
                # For rare cases, it's incompatibility between RabbitMQ and the machine running it,
                # - Use the Docker version of RabbitMQ instead: https://www.rabbitmq.com/download.html
            print("amqp_setup: Connection established successfully")
            break  # Connection successful, exit the loop
        except pika.exceptions.AMQPConnectionError as e:
            print(f"amqp_setup: Failed to connect: {e}")
            retries += 1
            print(f"amqp_setup: Retrying in {retry_interval} seconds...")
            time.sleep(retry_interval)

    if connection is None:
        raise Exception("amqp_setup: Unable to establish a connection to RabbitMQ after multiple attempts.")

    return connection

def create_channel(connection):
    print('amqp_setup:create_channel')
    channel = connection.channel()
    # Set up the exchange if the exchange doesn't exist
    print('amqp_setup:create exchange')
    channel.exchange_declare(exchange=exchangename, exchange_type=exchangetype, durable=True) # 'durable' makes the exchange survive broker restarts
    return channel

#function to create queues
def create_queues(channel):
    print('amqp_setup:create queues')
    create_error_queue(channel)
    create_activity_log_queue(channel)
    create_notification_queue(channel)

# function to create Activity_Log queue  
def create_activity_log_queue(channel):
    print('amqp_setup:create_activity_log_queue')
    channel.queue_declare(queue=a_queue_name, durable=True) # 'durable' makes the queue survive broker restarts
    channel.queue_bind(exchange=exchangename, queue=a_queue_name, routing_key='#')
        # bind the queue to the exchange via the key
        # 'routing_key=#' => any routing_key would be matched
    
# function to create Error queue
def create_error_queue(channel):
    print('amqp_setup:create_error_queue')
    channel.queue_declare(queue=e_queue_name, durable=True) # 'durable' makes the queue survive broker restarts
    #bind Error queue
    channel.queue_bind(exchange=exchangename, queue=e_queue_name, routing_key='*.error')
        # bind the queue to the exchange via the key
        # any routing_key with two words and ending with '.error' will be matched
    
def create_notification_queue(channel):
    print('amqp_setup:create_notification_queue')
    channel.queue_declare(queue=n_queue_name, durable=True) # 'durable' makes the queue survive broker restarts
    #bind Notification queue
    channel.queue_bind(exchange=exchangename, queue=n_queue_name, routing_key='*.notification')
        # bind the queue to the exchange via the key
        # any routing_key with two words and ending with '.notification' will be matched



if __name__ == "__main__":  # execute this program only if it is run as a script (not by 'import')   
    connection = create_connection()
    channel = create_channel(connection)
    create_queues(channel)
    connection.close() # close the connection when done
    print('amqp_setup: Setup done')
