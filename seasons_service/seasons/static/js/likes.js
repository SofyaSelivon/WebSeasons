function initLikeSystem() {
    const socket = new WebSocket("ws://" + window.location.host + "/ws/likes/index/");

    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeCount = document.getElementById('like-count');
    const dislikeCount = document.getElementById('dislike-count');

    let isSocketOpen = false;

    socket.onopen = () => {
        isSocketOpen = true;
        console.log('WebSocket connection opened.');
    };

    socket.onclose = () => {
        isSocketOpen = false;
        console.log('WebSocket connection closed.');
    };

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'counts') {
            likeCount.textContent = data.likes;
            dislikeCount.textContent = data.dislikes;
        }
        if (data.type === 'error') {
            alert(data.message);
        }
    };

    likeBtn.addEventListener('click', () => {
        if (isSocketOpen) {
            socket.send(JSON.stringify({ action: 'like' }));
        } else {
            alert('Соединение еще не установлено. Попробуйте позже.');
        }
    });

    dislikeBtn.addEventListener('click', () => {
        if (isSocketOpen) {
            socket.send(JSON.stringify({ action: 'dislike' }));
        } else {
            alert('Соединение еще не установлено. Попробуйте позже.');
        }
    });

    socket.onerror = (e) => {
        console.error('WebSocket error:', e);
    };

    setInterval(() => {
        if (isSocketOpen) {
            socket.send(JSON.stringify({ action: 'ping' }));
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', initLikeSystem);
