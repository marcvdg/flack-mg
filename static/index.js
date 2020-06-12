document.addEventListener('DOMContentLoaded', () => {
    const channel = localStorage.getItem('channel')
    const username = localStorage.getItem('username')
    console.log(username, channel)
    if (username === null) {
        window.location.href="/name"
    }
    else if (channel) {
        window.location.href="/messages/" + channel
    } 
    else {
        window.location.href="/channels/" 
    }
})