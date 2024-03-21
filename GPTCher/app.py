from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
import os

load_dotenv()

app = Flask(__name__)

# initialize the database connection 
def verify_connection(app):
    
    db_url = os.environ.get("DB_URI")
    db_key = os.environ.get("DB_KEY")
    
    try:
        Client = create_client(db_url, db_key)
        print('Connected to DB successfully')
        return True
        
    except Exception as error:
        print('Failed to connect to the database')
        print(error)
        return False

# NEED TO configure requirements.txt

# NEED TO extract from Sean's desc from Marketplace
    
@app.route('/')
def index():
    if verify_connection(app):
        return 'Welcome to GPTCher'
    else:
        return 'Welcome to GPTcher, but invalid connection to DB', 500
    
if __name__ == '__main__':
    with app.app_context():
        app.run(host='0.0.0.0', port=2100, debug=False)