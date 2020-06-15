document.addEventListener('DOMContentLoaded', () => {

    const username = localStorage.getItem('username')
    if (username === null) {
        window.location.href="/name"
    }
    
    // Get channel name from h1
    const current_channel = document.querySelector("#channelname").innerHTML
    localStorage.setItem('channel', current_channel)

    // Link Enter key to submit button
    const messagefield = document.querySelector('#messagefield');
    const msg_send = document.querySelector('#msg_send');
    const msg_warning = document.querySelector('#message_warning');
    const msg_box = document.querySelector('#messages')

    messagefield.addEventListener("keyup", function(event) {

    if (event.keyCode === 13) {
        event.preventDefault();
        msg_send.click();
    }
    });

    // Scroll down if needed
    function updateScroll(){
        msg_box.scrollTop = msg_box.scrollHeight;
    }
    updateScroll();

    // Remove message on click
    document.querySelectorAll('.chatremove').forEach(button => {
        button.onclick = () => {
            element.parentElement.remove();
        };
    });

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure button
    socket.on('connect', () => {
        
        msg_send.onclick = () => {
            message_warning.innerHTML = "" 
            const msg_text = messagefield.value;
            if (msg_text == "") {
                msg_warning.innerHTML = "Please type something :)"
            } 
            else {      
                messagefield.value = ""           
                socket.emit('send message', {'message': msg_text, 'user': localStorage.getItem('username'), 'channel': current_channel});
            }
        }
        
    })

    socket.on('new message', data => {
        if (data.ch ==  current_channel) {
            const msg_html = "<p>" + data.msg + "</p>"
            document.querySelector('#messages').insertAdjacentHTML('beforeend', msg_html) 
            updateScroll()
        }
    })
})
