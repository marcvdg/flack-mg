import os, datetime

from flask import Flask, render_template, request, jsonify, url_for
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
        self.output = user + " (" + timestamp + "): " + text  

#Global variables:
users = []
channels_dict = {}


#TODO: Check if localstorage has username, if so channels, if not name
@app.route("/")
def index():
    return render_template("index.html")

#TODO: Form that asks for name, check if name exists in usernames array 
@app.route("/name", methods=['GET', 'POST'])
def name():
    return render_template("name.html")

@app.route("/namecheck", methods=["POST"])
def namecheck():
    username = request.form.get("username")
    if username in users:
        return jsonify({"success": False})
    users.append(username)
    return jsonify({"success": True, "username": username, "path": url_for('channels')})

@app.route("/channelcheck", methods=["POST"])
def channelcheck():
    ch_input = request.form.get("ch_name")
    ch_new = Channel(ch_input,[])
    if ch_new.name in channels_dict:
        return jsonify({"success": False})
    channels_dict[ch_new.name] = ch_new
    return jsonify({"success": True, "name": ch_new.name, "path": url_for('channels')})

@app.route("/messageadd", methods=["POST"])
def messageadd():
    now = datetime.datetime.now()
    nowstring = now.strftime("%m/%d/%Y, %H:%M:%S")
    nw_msg = Message(nowstring,request.form.get("user"), request.form.get("message"))
    current = request.form.get("channel")
    print(nw_msg.output)
    channels_dict[current].messages.append(nw_msg) #if > 100, pop 1
    return jsonify({"success": True, "message": nw_msg.output})

#TODO: create homepage, give list of rooms, give option to create new room
@app.route("/channels")
def channels():
    return render_template("channels.html", channels_dict=channels_dict)

#TODO: create chatroom page, display latest 100 messages, offer form to type new message 
@app.route("/messages/<name>")
def messages(name):
    channel = channels_dict[name]
    print(channel.messages)
    return render_template("messages.html", channel = channel)
