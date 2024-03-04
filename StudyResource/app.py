import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import boto3
from uuid import uuid4
from utils import resize_image
from io import BytesIO
from models import db, StudyResource
load_dotenv()
 
app = Flask(__name__)

app.config.update(
    SQLALCHEMY_DATABASE_URI=os.environ["DB_URI"],
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SQLALCHEMY_ENGINE_OPTIONS={'pool_recycle': 299}
)
# initialize the database connection 
db.init_app(app)
CORS(app)

ALLOWED_EXTENSIONS = {
    'pdf',
    'doc', 'docx',  
    'xls', 'xlsx',  
    'ppt', 'pptx',  
}
with app.app_context(): 
       db.create_all() 

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def jsonResponse(rescode, **kwargs):
    res_data = {key: value for key, value in kwargs.items()}
    return jsonify(res_data), rescode


@app.route("/studyresource/<string:resourceID>", methods=['GET'])
def get_study_resource(resourceID):
    try:
        resource = db.session.scalars(db.select(StudyResource).filter_by(resourceID=resourceID).limit(1)).first()
        if resource:
            return jsonResponse(200, data=resource.json())
    except Exception as e:
        return jsonResponse(500, data={"resourceID":resourceID}, message="An error occurred while getting resourceID. "+str(e))
            
    
@app.route("/studyresource/upload", methods=['POST'])
def upload_study_resource():
    try:
        resource = request.files["resource"]
        rThumb = request.files["thumbnail"]        
        rID = uuid4().hex
        rName = resource.filename
        rDesc = request.form["description"]
        rPrice = float(request.form["price"])
        rLevel = request.form["level"]
        sID = request.form["userID"]
        sName = request.form["username"]

        print(rName, rDesc, rPrice, rLevel, sID, sName)
        # Check if file uploaded is appropriate type                
        if not allowed_file(resource.filename): 
            return jsonResponse(415, message="Incorrect media type")
        
        # create a session connection to s3
        session = boto3.Session(
            aws_access_key_id=os.environ["AWS_ACCESS_KEY"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        s3 = session.resource("s3") 
        
        # upload resource to s3
        new_filename = f"{rID}-{sName}.{resource.filename.rsplit('.', 1)[1].lower()}" 
        s3.Bucket(os.environ["AWS_S3_BUCKET_NAME"]).upload_fileobj(resource, new_filename, ExtraArgs={
            'ContentType': 'application/pdf',            
            'ContentDisposition': 'inline',
            'ACL': 'public-read'
        })

        # modify thumbnail and upload to s3
        new_thumbnail = resize_image(rThumb)
        new_thumbname = f"{rID}-{sName}.{rThumb.filename.rsplit('.', 1)[1].lower()}"
        s3.Bucket(os.environ["AWS_S3_BUCKET_NAME"]).upload_fileobj(BytesIO(new_thumbnail), new_thumbname, ExtraArgs={
            'ContentType': 'image/jpeg',            
            'ContentDisposition': 'inline',
            'ACL': 'public-read'
        })        

        # send all data to database         
        new_resource = StudyResource(
            resourceID=rID,
            resourceName=rName,
            resourceDesc=rDesc,
            resourcePrice=rPrice,
            resources3URL = f'https://{os.environ["AWS_S3_BUCKET_NAME"]}.s3.{os.environ["AWS_REGION"]}.amazonaws.com/{new_filename}',
            resourceThumbnailURL = f'https://{os.environ["AWS_S3_BUCKET_NAME"]}.s3.{os.environ["AWS_REGION"]}.amazonaws.com/{new_thumbname}',
            resourceLevel=rLevel,
            sellerID=sID,
            sellerName=sName
        )         
        db.session.add(new_resource)
        db.session.commit()       
        return jsonResponse(200, message="File successfully uploaded")
    except Exception as e:        
        return jsonResponse(500, code=500, message="Failed to upload resource. " + str(e))
    

@app.route("/studyresources/all", methods=['GET'])
def get_all_resources():
    try: 
        resources = db.session.scalars(db.select(StudyResource)).all()
        if len(resources):
            return jsonResponse(200, data=[resource.json() for resource in resources])
    except Exception as e:
        return jsonResponse(500, code=500, message="Failed to get all resources. " + str(e))


@app.route("/studyresources/<string:level>", methods=['GET'])
def get_resources_by_level(level):
    try:
        resources = db.session.scalars(db.select(StudyResource).where(StudyResource.resourceLevel==level)).all()
        if len(resources):
            return jsonResponse(200, data=[resource.json() for resource in resources])
        else:
            return jsonResponse(404, message="No data found")
    except Exception as e:
        return jsonResponse(500, data={"resourceLevel":level}, message="An error occurred while filtering resources by level. "+str(e))

     
if __name__ == "__main__":   
   app.run(host='localhost', port=8000, debug=True)