function updateVotes() {
    console.log("Пробуем обновить...");

    fetch('/api/mainvote_counts/')
        .then(response => response.json())
        .then(data => {
            console.log("Получено:", data);

            data.forEach(item => {
                const likesSpan = document.querySelector(`.mainvote-likes[data-id="${item.id}"]`);
                const dislikesSpan = document.querySelector(`.mainvote-dislikes[data-id="${item.id}"]`);

                if (likesSpan) likesSpan.textContent = item.likes;
                if (dislikesSpan) dislikesSpan.textContent = item.dislikes;
            });

            const labels = document.querySelectorAll('label');
            labels.forEach(label => {
                const text = label.textContent.trim().toLowerCase();
                if (text.includes('likes count')) {
                    const likesDiv = label.parentElement.querySelector('.readonly');
                    if (likesDiv && data[0]) likesDiv.textContent = data[0].likes;
                }
                if (text.includes('dislikes count')) {
                    const dislikesDiv = label.parentElement.querySelector('.readonly');
                    if (dislikesDiv && data[0]) dislikesDiv.textContent = data[0].dislikes;
                }
            });
        })
        .catch(console.error);
}

setInterval(updateVotes, 1000);
