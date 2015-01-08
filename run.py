from flask.ext.restless import APIManager
from app import app, db
from app.models.pomodoro import Pomodoro
from app.models.todo import Todo
from app.models.tag import Tag
from app.models.user import User

api_manager = APIManager(app, flask_sqlalchemy_db=db)
api_manager.create_api(Todo, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Tag, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Pomodoro, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(User, methods=['GET', 'POST', 'DELETE', 'PUT'])

db.create_all()
if __name__ == '__main__':
    from app.routes import index
    app.run(debug=True)
