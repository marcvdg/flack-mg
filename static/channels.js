document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('#username').innerHTML = 'Hi ' + localStorage.getItem('username') + '! '
    document.querySelector('#channelform').onsubmit = () => {

        // Initialize new request
        const ch_name = document.querySelector('#namefield').value;

        if (ch_name == "") {
            document.querySelector('#channel_warning').innerHTML = "Please type something :)"
            
        } 
        
        else {
            const request = new XMLHttpRequest();
            request.open('POST', '/channelcheck');

            request.onload = () => {

                const data = JSON.parse(request.responseText);
                console.log(data)
                if (data.success) {
                    return false;
                }
                else {
                    document.querySelector('#channel_warning').innerHTML = "Oh no, that name's taken! :("
                    return false;
                }
                
            }

            // Add data to send with request
            const data = new FormData();
            data.append('ch_name', ch_name);

            // Send request
            request.send(data);
            return false;
        }
    };

});
