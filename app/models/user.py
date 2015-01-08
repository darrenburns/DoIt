from app import db


class User(db.Model):

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    google = db.Column(db.String(128))
    display_name = db.Column(db.String(64), index=True)
    email = db.Column(db.String(120), index=True, unique=True)
    todos = db.relationship('Todo', backref='user', lazy='dynamic')

    def to_dict(self):
        return dict(id=self.id, email=self.email, displayName=self.display_name,
                    google=self.google)