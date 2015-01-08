from app import db
from app.models.todo import Todo


class Pomodoro(db.Model):

    __tablename__ = 'pomodoro'

    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.Integer, default=25 * 60)  # Time in seconds
    success = db.Column(db.Boolean)
    submitted = db.Column(db.DateTime, default=db.func.now())
    todo_id = db.Column(db.Integer, db.ForeignKey(Todo.id))