from app import db


class Tag(db.Model):

    __tablename__ = 'tag'
    __table_args__ = {"schema": "doit_v1"}

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, unique=True)
    deleted = db.Column(db.Boolean, default=False)