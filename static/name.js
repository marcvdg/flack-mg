document.addEventListener('DOMContentLoaded', () => {
    
    console.log("loaded")
    document.querySelector('#nameform').onsubmit = () => {

        // Initialize new request
        const username = document.querySelector('#namefield').value;
        console.log("taq")

        if (username == "") {
            console.log("empty")
            document.querySelector('#name_warning').innerHTML = "Please type something :)"
            return false;
        } 
        
        else {
            const request = new XMLHttpRequest();
            request.open('POST', '/namecheck');

            // Callback function for when request completes
            request.onload = () => {

                const data = JSON.parse(request.responseText);
                console.log(data)
                if (data.success) {
                    console.log("ok")
                    localStorage.setItem('username', username)
                    window.location.href = data.path
                }
                else {
                    console.log("nope")
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
