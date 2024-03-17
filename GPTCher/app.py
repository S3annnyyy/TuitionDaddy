import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from db import db, verify_connection

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}

# initialize the database connection 
CORS(app)
db.init_app(app)

with app.app_context():
    verify_connection(app)
    
if __name__ == '__main__':
    with app.app_context():
        app.run(host='0.0.0.0', port=2100, debug=True)