from functools import wraps
import json
import datetime
from flask import render_template, session, url_for, redirect, jsonify, request, g
import requests
import jwt
from app import app, db
from app.models.todo import Todo
from app.models.user import User
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SECRET_KEY, REDIRECT_URI



@app.route('/')
def index():
    return render_template('index.html')


def create_token(user):
    payload = {
        'sub': user.id,
        'iat': datetime.datetime.now(),
        'exp': datetime.datetime.now() + datetime.timedelta(days=14)
    }
    token = jwt.encode(payload, SECRET_KEY)
    return token.decode('unicode_escape')


@app.route(REDIRECT_URI, methods=['POST'])
def google():
    access_token_url = 'https://accounts.google.com/o/oauth2/token'
    people_api_url = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'

    payload = dict(client_id=GOOGLE_CLIENT_ID,
                   redirect_uri=request.json['redirectUri'],
                   client_secret=GOOGLE_CLIENT_SECRET,
                   code=request.json['code'],
                   grant_type='authorization_code')

    # Step 1. Exchange authorization code for access token.
    r = requests.post(access_token_url, data=payload)
    token = json.loads(r.text)
    headers = {'Authorization': 'Bearer {0}'.format(token['access_token'])}

    # Step 2. Retrieve information about the current user.
    r = requests.get(people_api_url, headers=headers)
    profile = json.loads(r.text)

    user = User.query.filter_by(google=profile['sub']).first()
    if user:
        token = create_token(user)
        return jsonify(token=token)
    print profile
    u = User(google=profile['sub'],
             display_name=profile['name'],
             email=profile['email'])
    db.session.add(u)
    db.session.commit()
    token = create_token(u)
    return jsonify(token=token)


def parse_token(req):
    token = req.headers.get('Authorization').split()[1]
    return jwt.decode(token, SECRET_KEY)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
            response.status_code = 401
            return response

        try:
            payload = parse_token(request)
        except jwt.DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except jwt.ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        g.user_id = payload['sub']

        return f(*args, **kwargs)

    return decorated_function


@app.route('/api/me')
@login_required
def me():
    user = User.query.filter_by(id=g.user_id).first()
    return jsonify(user.to_dict())

