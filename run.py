from flask.ext.restless import APIManager
from app import app, db
from app.models.todo import Todo
from app.models.tag import Tag

api_manager = APIManager(app, flask_sqlalchemy_db=db)
api_manager.create_api(Todo, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Tag, methods=['GET', 'POST', 'DELETE', 'PUT'])

db.create_all()
if __name__ == '__main__':
    app.run(debug=True)
