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