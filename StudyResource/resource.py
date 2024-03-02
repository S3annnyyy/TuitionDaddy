from flask import Flask, jsonify
 
app = Flask(__name__)
 
@app.route("/studyresource/<string:resourceID>", methods=['GET'])
def endpoint(resourceID):
    try:
        message = {"message": f"this is the resourceID: {resourceID}"}
        return jsonify(message)
    
        # connect to database, retrieve resource base on resourceID specified

        # if resourceID not found, return NotFoundError   
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "resourceID": resourceID
                },
                "message": "An error occurred while getting resourceID. " + str(e)
            }
        ), 500
     
if __name__ == "__main__":
   app.run(host='0.0.0.0', port=8000, debug=True)