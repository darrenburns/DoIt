from app import db
from app.models.tag import Tag
from app.models.user import User


todo_tags_assoc = db.Table('todo_tags',
                           db.Column('todo_id', db.Integer, db.ForeignKey('todo.id')),
                           db.Column('tag_id', db.Integer, db.ForeignKey(Tag.id))
)


class Todo(db.Model):

    __tablename__ = 'todo'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    text = db.Column(db.Text, unique=False)
    tags = db.relationship(Tag,
                           secondary=todo_tags_assoc,
                           backref=db.backref('todos', lazy='dynamic'))
    due = db.Column(db.DateTime, unique=False)
    created = db.Column(db.DateTime, unique=False, default=db.func.now())
    done = db.Column(db.Boolean, default=False)
    archived = db.Column(db.Boolean, default=False)
    deleted = db.Column(db.Boolean, default=False)
    note = db.Column(db.Text, unique=False)
    pomodoros = db.relationship('Pomodoro', backref='pomodoro', lazy='dynamic')

