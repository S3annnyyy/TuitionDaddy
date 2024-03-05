from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class StudyResource(db.Model):
    __tablename__ = "studyresource"
    uuid = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid4)
    resourceID = db.Column(db.UUID(as_uuid=True), nullable=False, default=uuid4)
    resourceName = db.Column(db.String(255), nullable=False)  
    resourceDesc = db.Column(db.String(255), nullable=False)
    resourcePrice = db.Column(db.Numeric(precision=10, scale=2))
    resources3URL = db.Column(db.String(255), nullable=False)
    resourceThumbnailURL = db.Column(db.String(255), nullable=False)
    resourceLevel = db.Column(db.String(255), nullable=False)    
    sellerID = db.Column(db.Integer, nullable=False)
    sellerName = db.Column(db.String(255), nullable=False)

    def json(self):
        return {
            "uuid": str(self.uuid),
            "resourceID": str(self.resourceID),
            "resourceName": self.resourceName,
            "resourceDesc": self.resourceDesc,
            "resourcePrice": float(self.resourcePrice) if self.resourcePrice is not None else None,
            "resources3URL": self.resources3URL,
            "resourceThumbnailURL": self.resourceThumbnailURL,
            "resourceLevel": self.resourceLevel,
            "sellerID": self.sellerID,
            "sellerName": self.sellerName
        }