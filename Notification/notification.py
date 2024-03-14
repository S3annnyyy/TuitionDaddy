import asyncio
import json
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import amqp_connection
import aiohttp
from os import environ
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

MAX_RETRIES = 3  # Maximum number of retries for message processing

async def send_email(subject, message, recipient):
    try:
        # Create a multipart message
        msg = MIMEMultipart()
        msg['Subject'] = subject
        msg['From'] = EMAIL_USERNAME
        msg['To'] = recipient

        # Create HTML content with image and links
        html_content = f"""
        <html>
        <body>
            <p>{message}</p>
            <p><img src="cid:logo" alt="Logo"></p>
            <p>Thank you! For any queries, please contact us at <a href="mailto:support@example.com">tuitiondaddyesd@gmail.com</a>.</p>
        </body>
        </html>
        """

        # Attach HTML content
        msg.attach(MIMEText(html_content, 'html'))

        # Load logo image and attach it to the email
        logo_path = 'assets/logo.png'  # Update with the path to your logo image
        with open(logo_path, 'rb') as logo_file:
            logo = MIMEImage(logo_file.read())
            logo.add_header('Content-ID', '<logo>')
            msg.attach(logo)

        # Create SMTP server connection and send email
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USERNAME, recipient, msg.as_string())
    except Exception as e:
        logger.error(f"Failed to send email: {e}")

async def send_telegram_message(chat_id, message):
    try:
        url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
        params = {
            'chat_id': chat_id,
            'text': message
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.text()
    except Exception as e:
        logger.error(f"Failed to send Telegram message: {e}")

async def consume_queue():
    try:
        connection = await amqp_connection.create_connection()
        async with connection:
            channel = await connection.channel()
            queue = await channel.declare_queue(
                QUEUE_NAME,
                durable=True,
                arguments={'x-dead-letter-exchange': 'dlx'}
            )

            async for message in queue:
                async with message.process():
                    if message.body is None:
                        logger.warning("Received empty message. Ignoring...")
                        continue
                    
                    data = json.loads(message.body.decode())
                    logger.info(f"Received message: {data}")

                    retry_count = data.get('retry_count', 0)
                    if retry_count >= MAX_RETRIES:
                        logger.warning("Max retries exceeded. Moving message to DLX.")
                        await message.reject(requeue=False)
                        continue

                    try:
                        if 'chat_id' in data and 'telegram_message' in data:
                            # Handle Telegram notification
                            telegram_chat_id = data['chat_id']
                            telegram_message = data['telegram_message']
                            await send_telegram_message(telegram_chat_id, telegram_message)
                        elif 'email' in data and 'email_message' in data and 'email_subject' in data:
                            # Handle email notification
                            email_subject = data['email_subject']
                            email_message = data['email_message']
                            email_recipient = data['email']
                            await send_email(email_subject, email_message, email_recipient)
                        else:
                            logger.warning("Invalid message format. Ignoring...")
                    except Exception as e:
                        logger.error(f"Error processing message: {e}")
                        retry_count += 1
                        data['retry_count'] = retry_count
                        await channel.default_exchange.publish(
                            aio_pika.Message(body=json.dumps(data).encode()),
                            routing_key=QUEUE_NAME
                        )
    except Exception as e:
        logger.error(f"Consumer error: {e}")

async def shutdown():
    logger.info("Shutting down...")
    # Add cleanup logic here

if __name__ == "__main__":
    try:
        asyncio.run(consume_queue())
    except KeyboardInterrupt:
        asyncio.run(shutdown())
