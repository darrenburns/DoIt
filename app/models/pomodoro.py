from app import db


class Pomodoro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.Integer, default=25 * 60)  # Time in seconds
    success = db.Column(db.Boolean)
    submitted = db.Column(db.DateTime, default=db.func.now())
    todo_id = db.Column(db.Integer, db.ForeignKey(''
                                                  'todo.id'))