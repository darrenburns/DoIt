from app import db


class Tag(db.Model):

    __tablename__ = 'tag'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, unique=True)
    deleted = db.Column(db.Boolean, default=False)