import asyncio
import json
import smtplib
from email.mime.text import MIMEText
import requests
from dotenv import load_dotenv
import amqp_connection
import aiohttp
from os import environ

# Manually load the .env file
load_dotenv()

# Set the queue name from environment variables
QUEUE_NAME = environ.get('N_QUEUE_NAME')  # Activity_Log

# Configuration for Telegram Bot
TELEGRAM_BOT_TOKEN = environ.get('TELEGRAM_TOKEN')
TELEGRAM_CHAT_ID = environ.get('TELEGRAM_CHAT_ID')

# Configuration for Email
EMAIL_HOST = environ.get('EMAIL_HOST')
EMAIL_PORT = environ.get('EMAIL_PORT')
EMAIL_USERNAME = environ.get('EMAIL_USERNAME')
EMAIL_PASSWORD = environ.get('EMAIL_PASSWORD')

async def send_email(subject, message, recipient):
    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = EMAIL_USERNAME
    msg['To'] = recipient

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.sendmail(EMAIL_USERNAME, recipient, msg.as_string())


async def send_telegram_message(chat_id, message):
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
    params = {
        'chat_id': chat_id,
        'text': message
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as response:
            return await response.text()


async def consume_queue():
    connection = await amqp_connection.create_connection()
    async with connection:
        channel = await connection.channel()
        queue = await channel.declare_queue(QUEUE_NAME, durable=True)

        async for message in queue:
            async with message.process():
                data = json.loads(message.body.decode())
                print("Received message:", data)  # Add this line for debugging
                
                # Handle email notification
                email_subject = "Notification Subject"
                email_message = f"Notification Message for Email: {data['scheduled_date']}"
                email_recipient = data['email']
                await send_email(email_subject, email_message, email_recipient)
                
                # Handle Telegram notification
                telegram_chat_id = data['chat_id']
                telegram_message = f"Notification Message for Telegram: {data['scheduled_date']}"
                await send_telegram_message(telegram_chat_id, telegram_message)



if __name__ == "__main__":
    asyncio.run(consume_queue())
