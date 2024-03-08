#!/usr/bin/env python3
import amqp_connection
import json
import pika
from os import environ
from dotenv import load_dotenv
import os

# Manually load the .env file
load_dotenv()

n_queue_name = environ.get('N_QUEUE_NAME') #Activity_Log

def receiveNotification(channel):
    try:
        # set up a consumer and start to wait for coming messages
        channel.basic_consume(queue=n_queue_name, on_message_callback=callback, auto_ack=True)
        print('Notification: Consuming from queue:', n_queue_name)
        channel.start_consuming()  # an implicit loop waiting to receive messages;
            #it doesn't exit by default. Use Ctrl+C in the command window to terminate it.
    
    except pika.exceptions.AMQPError as e:
        print(f"Notification: Failed to connect: {e}") # might encounter error if the exchange or the queue is not created

    except KeyboardInterrupt:
        print("Notification: Program interrupted by user.") 


def callback(channel, method, properties, body): # required signature for the callback; no return
    print("\nNotification: Received a user to notify by " + __file__)

    purchaseNotification(body)

    bookingNotification(body)

    gptcherNotification(body)


    # print()

def purchaseNotification(order):
    #add to the database
    print("Notification: Purchase notification recorded successfully")

def bookingNotification(order):
    #add to the database
    print("Notification: Booking notification recorded successfully")

def gptcherNotification(order):
    #add to the database
    print("Notification: GPTcher notification recorded successfully")


if __name__ == "__main__":  # execute this program only if it is run as a script (not by 'import')
    print("Notification: Getting Connection")
    connection = amqp_connection.create_connection() #get the connection to the broker
    print("Notification: Connection established successfully")
    channel = connection.channel()
    receiveNotification(channel)
    connection.close() # close the connection when done
