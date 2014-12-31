from app import app, db
from app.models.todo import Todo
from app.models.tag import Tag

db.create_all()
if __name__ == '__main__':
    app.run(debug=True)
