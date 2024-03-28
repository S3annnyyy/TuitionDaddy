from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
from os import environ

import requests

import pika
import json
import amqp_connection

from dotenv import load_dotenv

# Manually load the .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

exchangename = environ.get('EXCHANGENAME') 
exchangetype = environ.get('EXCHANGETYPE') 

#create a connection and a channel to the broker to publish messages to activity_log, error queues
connection = amqp_connection.create_connection() 
channel = connection.channel()

#if the exchange is not yet created, exit the program
if not amqp_connection.check_exchange(channel, exchangename, exchangetype):
    print("\nCreate the 'Exchange' before running this microservice. \nExiting the program.")
    sys.exit(0)  # Exit with a success status

#testing the different queues

message = "error message test"
channel.basic_publish(exchange=exchangename, routing_key="order.error", 
            body=message, properties=pika.BasicProperties(delivery_mode = 2)) # make the message persistent within the matching queues until it is received by some receiver (the matching queues have to exist and be durable and bound to the exchange)

message_email = {
    "email": "tuitiondaddyesd@gmail.com", 
    "email_message": "Your payment is successful! Thank you for your order.",
    "email_subject": "Payment Confirmation",
    "scheduled_date": "2024-03-09T10:00:00", 
}

message_json = json.dumps(message_email)
channel.basic_publish(exchange=exchangename, routing_key="order.notification", 
            body=message_json, properties=pika.BasicProperties(delivery_mode = 2)) 

message_tele = {
    "chat_id": "536882053", 
    "scheduled_date": "2024-03-09T10:00:00", 
    "telegram_message": "Good afternoon kaelan! Wishing you a bright and insightful afternoon! Your intellect shines brightly, illuminating every conversation and idea you engage with. Keep inspiring us with your brilliance and creativity. Have a wonderful day ahead",
}

message_json = json.dumps(message_tele)
channel.basic_publish(exchange=exchangename, routing_key="order.notification", 
            body=message_json, properties=pika.BasicProperties(delivery_mode = 2)) 

    
# Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for placing an order...")
    app.run(host="0.0.0.0", port=5100, debug=True, use_reloader=False)
