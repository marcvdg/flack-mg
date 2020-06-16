document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('#nameform').onsubmit = () => {

        // Initialize new request
        const username = document.querySelector('#namefield').value;

        if (username == "") {
            document.querySelector('#name_warning').innerHTML = "Please type something :)"
            return false;
        } 
        
        else {
            const request = new XMLHttpRequest();
            request.open('POST', '/namecheck');

            // Callback function for when request completes
            request.onload = () => {

                const data = JSON.parse(request.responseText);
                if (data.success) {
                    localStorage.setItem('username', username)
                    window.location.href = data.path
                }
                else {
                    document.querySelector('#name_warning').innerHTML = "Oh no, that name's taken! :("
                }
                
            }
        
            // Add data to send with request
            const data = new FormData();
            data.append('username', username);

            // Send request
            request.send(data);
            return false;
        }
    };

});
