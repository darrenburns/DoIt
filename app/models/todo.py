from app import db

todo_tags_assoc = db.Table('todo_tags',
                           db.Column('todo_id', db.Integer, db.ForeignKey('todo.id')),
                           db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, unique=False)
    tags = db.relationship('Tag',
                           secondary=todo_tags_assoc,
                           backref=db.backref('todos', lazy='dynamic'))
    due = db.Column(db.DateTime, unique=False)
    created = db.Column(db.DateTime, unique=False, default=db.func.now())
    done = db.Column(db.Boolean, unique=False, default=False)
    archived = db.Column(db.Boolean, unique=False, default=False)
    pomodoros = db.relationship('Pomodoro', backref='pomodoro', lazy='dynamic')
