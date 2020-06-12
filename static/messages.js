document.addEventListener('DOMContentLoaded', () => {
    
    // Get channel name from h1
    const current_channel = document.querySelector("#channelname").innerHTML
    localStorage.setItem('channel', current_channel)

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure button
    socket.on('connect', () => {
        
        document.querySelector('#msg_send').onclick = () => {
            const msg_text = document.querySelector('#messagefield').value;
            console.log(msg_text)
            if (msg_text == "") {
                document.querySelector('#message_warning').innerHTML = "Please type something :)"
            } 
            else {                 
                socket.emit('send message', {'message': msg_text, 'user': localStorage.getItem('username'), 'channel': current_channel});
            }
        }
        
    })

    socket.on('new message', data => {
        if (current_channel ==  current_channel) {
            const msg_html = "<p>" + data + "</p>"
            document.querySelector('#messages').insertAdjacentHTML('beforeend', msg_html) 
        }
    })
})
