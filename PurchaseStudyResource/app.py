import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)


def jsonResponse(rescode, **kwargs):
    res_data = {key: value for key, value in kwargs.items()}
    return jsonify(res_data), rescode

studyresourceURL = "http://localhost:8000/studyresources"
userURL = "http://localhost:3000/userinfo"

@app.route("/purchasestudyresource", methods=['POST'])
def purchase_study_resource():
    try:
        # Check if data parsed are in JSON format    
        if request.is_json:
            data = request.get_json()           
            return jsonResponse(200, message=f"Study resource ID: {data['resourceID']} purchased!")
        else:
            return jsonResponse(400, message="Invalid JSON input")
    except Exception as e:
        # handle error
        return jsonResponse(500, message=f"Purchase study resource internal error: {e}")
    
def processResourcePurchase():
    raise NotImplementedError

if __name__ == "__main__":
    print(f"This is flask complex microservice {os.path.basename(__file__)} for purchasing study resource")          
    app.run(host="0.0.0.0", port=5100, debug=True)