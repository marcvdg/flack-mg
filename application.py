import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)



#Classes, TODO: move to model file

class Channel:
    def __init__(self, name, messages):
        self.name = name
        self.messages = []


class Message:
    def __init__(self, timestamp, user, text):
        self.timestamp = timestamp
        self.user = user
        self.text = text
        self.output = "(" + timestamp + ") " + user + ": " + text  

#Global variables:
users = []
channels = []

#test stuff
testchannel = Channel("test", [])

testmessage = Message("now", "Marc", "Testies")
testchannel.messages.append(testmessage)

print(testchannel.messages[0].output)

#TODO: Check if localstorage has username, if so home, if not welcome
@app.route("/")
def index():
    
    return render_template("index.html")

#TODO: Form that asks for name, check if name exists in usernames array 
@app.route("/welcome", methods=['GET', 'POST'])
def welcome():
    if request.method == 'POST':
        username = request.form['namefield']
        if username not in user_set:
            users.append(username)
            return render_template("home.html") 
        else:
            print('except')
            return render_template("welcome.html", scen='exists')     
    else:
        # In case of a GET request, see if there are any special messages that need showing (args passed)
        return render_template("welcome.html")

@app.route("/namecheck", methods=["POST"])
def namecheck():
    username = request.form.get("username")
    if username in users:
        return jsonify({"success": False})

    return jsonify({"success": True, "username": username})


#TODO: create homepage, give list of rooms, give option to create new room
@app.route("/home")
def home():
    return render_template("home.html")

#TODO: create chatroom page, display latest 100 messages, offer form to type new message 
@app.route("/channel/<name>")
def channel():
    return render_template("channel.html")
