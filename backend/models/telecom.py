from models.database import db
from datetime import datetime


class TelecomDirectory(db.Model):
    __tablename__ = "telecom_directory"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    extension_number = db.Column(
        db.String(20),
        nullable=False,
        unique=True
    )

    department_name = db.Column(
        db.String(100),
        nullable=False
    )

    team_name = db.Column(
        db.String(100),
        nullable=False
    )

    contact_person = db.Column(
        db.String(150)
    )

    direct_number = db.Column(
        db.String(20)
    )

    location = db.Column(
        db.String(100)
    )

    status = db.Column(
        db.String(20),
        default="Active"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "extension_number": self.extension_number,
            "department_name": self.department_name,
            "team_name": self.team_name,
            "contact_person": self.contact_person,
            "direct_number": self.direct_number,
            "location": self.location,
            "status": self.status
        }