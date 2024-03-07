#!/usr/bin/env python3
import amqp_connection
import json
import pika
from os import environ

# Instead of hardcoding the values, we can also get them from the environ as shown below
e_queue_name = environ.get('E_QUEUE_NAME') #Error

def receiveError(channel):
    try:
        # set up a consumer and start to wait for coming messages
        channel.basic_consume(queue=e_queue_name, on_message_callback=callback, auto_ack=True)
        print('error microservice: Consuming from queue:', e_queue_name)
        channel.start_consuming() # an implicit loop waiting to receive messages; 
        #it doesn't exit by default. Use Ctrl+C in the command window to terminate it.
    
    except pika.exceptions.AMQPError as e:
        print(f"error microservice: Failed to connect: {e}") 

    except KeyboardInterrupt:
        print("error microservice: Program interrupted by user.")

def callback(channel, method, properties, body): # required signature for the callback; no return
    print("\nerror microservice: Received an error by " + __file__)
    # processError(body)

    #logic to call the error processing function

    #scenario 1: errors
    sellerCredentialsError(json.loads(body))

    paymentConfirmationError(json.loads(body))

    studyResourceError(json.loads(body))

    #scenario 2: errors
    bookingResultError(json.loads(body))

    zoomLinkError(json.loads(body))

    #scenario 3: errors
    OpenAIError(json.loads(body))

    print()

# def processError(errorMsg):
#     print("error microservice: Printing the error message:")
#     try:
#         error = json.loads(errorMsg)
#         print("--JSON:", error)
#     except Exception as e:
#         print("--NOT JSON:", e)
#         print("--DATA:", errorMsg)
#     print()
    
def sellerCredentialsError(error):
    #add to the database
    print("error microservice: Seller credentials error recorded successfully")

def paymentConfirmationError(error):
    #add to the database
    print("error microservice: Payment confirmation error recorded successfully")

def studyResourceError(error):
    #add to the database
    print("error microservice: Study resource error recorded successfully")

def bookingResultError(error):
    #add to the database
    print("error microservice: Booking result error recorded successfully")

def zoomLinkError(error):
    #add to the database
    print("error microservice: Zoom link error recorded successfully")

def OpenAIError(error):
    #add to the database
    print("error microservice: OpenAI error recorded successfully")



if __name__ == "__main__": # execute this program only if it is run as a script (not by 'import')    
    print("error microservice: Getting Connection")
    connection = amqp_connection.create_connection() #get the connection to the broker
    print("error microservice: Connection established successfully")
    channel = connection.channel()
    receiveError(channel)
    connection.close() # close the connection when done

