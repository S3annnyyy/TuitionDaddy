import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
 
app = Flask(__name__)

app.config.update(
    SQLALCHEMY_DATABASE_URI=os.environ["DB_URI"],
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SQLALCHEMY_ENGINE_OPTIONS={'pool_recycle': 299}
)
# initialize the database connection 
db = SQLAlchemy(app)
CORS(app)    

@app.route("/studyresource/<string:resourceID>", methods=['GET'])
def endpoint(resourceID):
    try:
        message = {"message": f"this is the resourceID: {resourceID}"}      
        from models import User 
        new_user = User(username='asdasdasn', email='asdsadasdjn@example.com')
        db.session.add(new_user)
        db.session.commit()
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
   with app.app_context(): 
       db.create_all() 
   app.run(host='0.0.0.0', port=8000, debug=True)