document.addEventListener('DOMContentLoaded', () => {
    
    const current_channel = document.querySelector("#channelname").innerHTML
    localStorage.setItem('channel', current_channel)
    document.querySelector('#messageform').onsubmit = () => {

        // Initialize new request
        const msg_text = document.querySelector('#messagefield').value;

        if (msg_text == "") {
            
            document.querySelector('#message_warning').innerHTML = "Please type something :)"
            
        } 
        else {
            const request = new XMLHttpRequest();
            request.open('POST', '/messageadd');

            request.onload = () => {

                const data = JSON.parse(request.responseText);
                console.log(data)
                if (data.success) {
                    console.log("ok")
                    document.querySelector('#message_warning').innerHTML = "Sent!"
                    return false;
                }
                else {
                    document.querySelector('#message_warning').innerHTML = "Oh no, ERROR! :("
                    return false;
                }
                
            }

            // Add data to send with request
            const data = new FormData();
            data.append('message', msg_text);
            data.append('user', localStorage.getItem('username'))
            data.append('channel', current_channel)
            

            // Send request
            request.send(data);
            return false;
        }
    };

});
