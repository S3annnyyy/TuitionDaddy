from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def verify_connection(app):
    try:
        engine = db.get_engine()
        conn = engine.connect()
        conn.close()
        print('Connected to DB successfully')
        
    except Exception as error:
        print('Failed to connect to the database')
        print(error)