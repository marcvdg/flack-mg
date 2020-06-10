document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#nameform').onsubmit = () => {

        // Initialize new request
        const request = new XMLHttpRequest();
        const username = document.querySelector('#namefield').value;
        request.open('POST', '/namecheck');

        // Callback function for when request completes
        request.onload = () => {
            console.log("ok")
            localStorage.setItem('username', username)
        }

        // Add data to send with request
        const data = new FormData();
        data.append('username', username);

        // Send request
        request.send(data);
        return false;
    };

});
