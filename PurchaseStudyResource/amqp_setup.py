import aio_pika
import asyncio
from os import environ
from dotenv import load_dotenv

load_dotenv()

# Set the RabbitMQ connection parameters for localhost
RABBITMQ_HOST = environ.get('HOSTNAME')  
RABBITMQ_PORT = int(environ.get('PORT')) 
RABBITMQ_USERNAME = environ.get('RABBITMQ_USERNAME')
RABBITMQ_PASSWORD = environ.get('RABBITMQ_PASSWORD')

async def create_connection(max_retries=12, retry_interval=5):
    print('amqp_connection: Create_connection')
    
    retries = 0
    connection = None
    
    # loop to retry connection upto 12 times with a retry interval of 5 seconds
    while retries < max_retries:
        try:
            print('amqp_connection: Trying connection')
            # connect to the broker
            connection = await aio_pika.connect_robust(
                host=RABBITMQ_HOST,
                port=RABBITMQ_PORT,
                login=RABBITMQ_USERNAME,
                password=RABBITMQ_PASSWORD
            )
            print("amqp_connection: Connection established successfully")
            break  # Connection successful, exit the loop
        except aio_pika.exceptions.AMQPConnectionError as e:
            print(f"amqp_connection: Failed to connect: {e}")
            retries += 1
            print(f"amqp_connection: Retrying in {retry_interval} seconds...")
            await asyncio.sleep(retry_interval)
    
    if connection is None:
        raise Exception("Unable to establish a connection to RabbitMQ after multiple attempts")
    
    return connection

# function to check if the exchange exists
async def check_exchange(channel, exchangename, exchangetype):
    try:    
        await channel.exchange_declare(exchangename, exchangetype, durable=True, passive=True) 
            # passive (bool): If set, the server will reply with Declare-Ok if the 
            # exchange already exists with the same name, and raise an error if not. 
            # The client can use this to check whether an exchange exists without 
            # modifying the server state.            
    except Exception as e:
        print('Exception:', e)
        return False
    return True

if __name__ == "__main__":
    asyncio.run(create_connection())
