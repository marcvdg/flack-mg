document.addEventListener('DOMContentLoaded', () => {

    // Check if there's a username – if not, send to username form    
    const username = localStorage.getItem('username')
    if (username === null) {
        window.location.href="/name"
    }

    // Display 'remove' button for user's chats
    const msgs = document.querySelectorAll('.chatmsg')
            for (var i = 0; i < msgs.length; i++) {
                if (msgs[i].getAttribute('data-user') == username) {
                    msgs[i].childNodes[1].classList.add('active')
                }
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
    

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure button
    socket.on('connect', () => {
        
        // 'Send' button
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

        // 'Remove message' buttons
        document.querySelector("#messages").addEventListener("click", (e) => {
            if (e.target && e.target.nodeName == "I") {
                const msg_text = e.target.previousSibling.innerHTML
                socket.emit('remove message', {'message': msg_text, 'channel': current_channel})   
            }
        })
        
    })

    // Receive 'add message' message and add it to the lsit
    socket.on('new message', data => {
        if (data.ch ==  current_channel) {
            let active = ""
            if (username == data.usr) {
                active = "active"
            }
            const msg_html = "<p class='chatmsg' data-user='>" + data.usr + "<'><span class='chattxt'>" + data.msg + "</span><i class='fas fa-times chatremove " + active + "'></i></p>"
            document.querySelector('#messages').insertAdjacentHTML('beforeend', msg_html) 
            updateScroll()
        }
           
    })

    // Receive 'remove message' message and remove it from the list
    socket.on('message removed', data => {
        if (data.ch ==  current_channel) {
            const messages = document.querySelectorAll('.chattxt')
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].innerHTML == data.msg) {
                    messages[i].parentElement.remove()
                }
            }
            updateScroll()
        }
           
    })
})
