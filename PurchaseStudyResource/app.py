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

studyresourceURL = "http://studyresource:8000/studyresources"
userURL = "http://user:3000/user/paymentdetails"
paymentURL = "http://payment:8080/payment"

@app.route("/purchasestudyresource", methods=['POST'])
def purchase_study_resource():
    try:
        # Check if data parsed are in JSON format    
        if request.is_json:
            data = request.get_json()
            result = processResourcePurchase(data['SellerID'], data['Price'], data['Resources'], data['PaymentMethodID'], data['Description'], data['UserID'])    
            return jsonResponse(200, message=f"Study resource ID: {data['Resources']} purchased!", data=result)
        else:
            return jsonResponse(400, message="Invalid JSON input")
    except Exception as e:
        return jsonResponse(500, message=f"Purchase study resource internal error: {e}")
    
def processResourcePurchase(sellerID:int, price: float, resources: list, paymentMethodID:str, desc:str, buyerID:str) -> None:
    
    """
    Process a resource purchase transaction.

    Args:        
        sellerID (int): The ID of the seller.
        price (float): The total purchase cost
        resources (list): Array of the ID of the resources being purchased.
        paymentMethodID (str): To generate Stripe intent
        desc (str): Description of the purchase
        buyerID (int): The ID of the buyer.        
    """
    print(sellerID, price, resources, paymentMethodID, desc, buyerID)

    print("\n --------INVOKING user microservice GET SELLER STRIPE ACC ID--------")
    user_result = invoke_http(userURL, method="GET", json={"UserID": int(sellerID)})    
    sellerStripeAccID = user_result['data']
    print(sellerStripeAccID)

    print("\n --------INVOKING payment microservice MAKE PURCHASE--------")
    paymentBody = {
        "Price": int(price),
        "Description": str(desc),
        "UserID":  str(buyerID),
        "SellerID": str(sellerID),
        "StripeAccountID": str(sellerStripeAccID),
        "PaymentMethodID": str(paymentMethodID)
    }      
    paymentResult = invoke_http(paymentURL, method="POST", json=paymentBody)
    print(paymentResult)

    print("\n --------INVOKING studyresource microservice GET RESOURCE--------")
    urlLinks = {}
    for resource in resources:
        print(resource)
        resource_result = invoke_http(f"{studyresourceURL}/{resource['resourceID']}", method="GET")
        url = resource_result['data']['resources3URL']
        print(f"resource: {url} obtained")
        urlLinks[resource['resourceName']] = url
    print(urlLinks)

    print("\n --------INVOKING Error & Notif microservice via AMPQ--------")
    # TODO

    return urlLinks

if __name__ == "__main__":
    print(f"This is flask complex microservice {os.path.basename(__file__)} for purchasing study resource")          
    app.run(host="0.0.0.0", port=5100, debug=True)