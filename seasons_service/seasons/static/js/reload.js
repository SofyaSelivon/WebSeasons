function updateVotes() {
    console.log("Пробуем обновить...");

    fetch('/api/mainvote_counts/')
        .then(response => response.json())
        .then(data => {
            console.log("Получено:", data);

            data.forEach(item => {
                const row = document.querySelector(`a[href="/admin/seasons/mainvote/${item.id}/change/"]`)?.closest('tr');
                if (!row) {
                    console.warn(`Не нашёл строку для id=${item.id}`);
                    return;
                }
                console.log(`Нашёл строку для id=${item.id}`);

                const likesCell = row.querySelector('th.field-likes_count');
                const dislikesCell = row.querySelector('td.field-dislikes_count');

                if (likesCell) {
                    const likesLink = likesCell.querySelector('a');
                    if (likesLink) {
                        likesLink.textContent = item.likes;
                        console.log(`Обновил лайки для id=${item.id} на ${item.likes}`);
                    } else {
                        console.warn(`Не нашёл ссылку лайков для id=${item.id}`);
                    }
                }

                if (dislikesCell) {
                    dislikesCell.textContent = item.dislikes;
                    console.log(`Обновил дизлайки для id=${item.id} на ${item.dislikes}`);
                } else {
                    console.warn(`Не нашёл дизлайки для id=${item.id}`);
                }
            });
        })
        .catch(console.error);
}

setInterval(updateVotes, 2000);
