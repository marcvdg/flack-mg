# Project 2

Web Programming with Python and JavaScript

A simple chat application using Flask, JS and websockets. Does the following:
* On first entry, asks user for display name (which can later be changed)
* Allows user to create channel
* Lets user enter and chat in channel, displaying name and timestamp
* Lets user remove their own messages, though not those of others
* Remembers display name and last-visited channel and takes user to that channel

Files:
* Application.py contains main app
* Models.py contains message and channel classes 
* Name.html and name.js handle the display name prompt
* Channels.html and channels.js allow creating channels and visiting them through a list
* Messages.html and messages.js allow viewing the channel chat and entering and removing messages. 
* Procfile is there for Heroku

