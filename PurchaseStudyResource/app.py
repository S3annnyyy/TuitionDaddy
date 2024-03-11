import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from invokes import invoke_http 

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
            result = processResourcePurchase(data['resourceID'], data['sellerID'], data['buyerID'], data['buyerToken'], data['buyerPaymentDetails'])    
            return jsonResponse(200, message=f"Study resource ID: {data['resourceID']} purchased!")
        else:
            return jsonResponse(400, message="Invalid JSON input")
    except Exception as e:
        return jsonResponse(500, message=f"Purchase study resource internal error: {e}")
    
def processResourcePurchase(resourceID: int, sellerID: int, buyerID: int, buyerToken: str, buyerPaymentDetails: dict) -> None:
    """
    Process a resource purchase transaction.

    Args:
        resourceID (int): The ID of the resource being purchased.
        sellerID (int): The ID of the seller.
        buyerID (int): The ID of the buyer.
        buyerPaymentDetails (dict): A dictionary containing payment details provided by the buyer.
    """
    print(resourceID, buyerID, sellerID, buyerPaymentDetails)

    print("\n --------INVOKING user microservice--------")
    user_result = invoke_http(userURL, method="GET", cookies={'Authorization': buyerToken})    
    print(user_result)

    print("\n --------INVOKING payment microservice--------")
    # TODO

    print("\n --------INVOKING studyresource microservice--------")
    resource_result = invoke_http(f"{studyresourceURL}/{resourceID}", method="GET")
    resource = resource_result['data']['resources3URL']
    print(f"resource: {resource} obtained")

    print("\n --------INVOKING Error & Notif microservice via AMPQ--------")
    # TODO 

if __name__ == "__main__":
    print(f"This is flask complex microservice {os.path.basename(__file__)} for purchasing study resource")          
    app.run(host="0.0.0.0", port=5100, debug=True)