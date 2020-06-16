import os, datetime

from models import *

from flask import Flask, render_template, request, jsonify, url_for, redirect
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global variables:
users = []
channels_dict = {}

# Set initial channel and add it to dict
test_channel = Channel("Test channel", [])
channels_dict["Test channel"] = test_channel

# Check if localstorage has username, if so channels, if not name
@app.route("/")
def index():
    return render_template("index.html")

# Asks for username
@app.route("/name", methods=['GET', 'POST'])
def name():
    return render_template("name.html")

# Check if name exists in usernames list, if not add it 
@app.route("/namecheck", methods=["POST"])
def namecheck():
    username = request.form.get("username")
    if username in users:
        return jsonify({"success": False})
    users.append(username)
    return jsonify({"success": True, "username": username, "path": url_for('channels')})

# Check if channel exists in channels list, if not add it 
@app.route("/channelcheck", methods=["POST"])
def channelcheck():
    ch_input = request.form.get("ch_name")
    ch_new = Channel(ch_input,[])
    if ch_new.name in channels_dict:
        return jsonify({"success": False})
    channels_dict[ch_new.name] = ch_new
    return jsonify({"success": True, "name": ch_new.name, "path": url_for('channels')})

# Channels page: offer list of rooms, give option to create new room
@app.route("/channels")
def channels():
    return render_template("channels.html", channels_dict=channels_dict)

# Single channel page, display latest 100 messages, offer form to type new message 
@app.route("/messages/<name>")
def messages(name):
    try:
        channel = channels_dict[name]
    except: 
        return redirect(url_for('channels'))
    return render_template("messages.html", channel = channel)

# Get message text and broadcast it with timestamp and user
@socketio.on("send message")
def send(data):
    now = datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    nw_msg = Message(now, data["user"], data["message"])
    current = data["channel"]
    msg_list = channels_dict[current].messages
    msg_list.append(nw_msg)
    if len(msg_list) > 100:
        msg_list.pop(0)
    msg_output = nw_msg.output
    emit("new message", {'msg': nw_msg.output, 'usr': nw_msg.user, 'ch': current}, broadcast=True)

# Remove message based on output
@socketio.on("remove message")
def remove(data):
    current = data["channel"]
    msg_list = channels_dict[current].messages
    msg_output = data["message"]
    msg_list[:] = [msg for msg in msg_list if not msg.output == msg_output]
    emit("message removed", {'msg': msg_output, 'ch': current}, broadcast=True)
