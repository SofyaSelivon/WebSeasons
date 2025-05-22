import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class LikeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("likes_group", self.channel_name)
        await self.send_counts()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("likes_group", self.channel_name)

    async def receive(self, text_data):
        from django.contrib.auth import get_user_model
        from .models import Vote, MainVote

        data = json.loads(text_data)
        user = self.scope["user"]
        action = data.get("action")

        if action in ['like', 'dislike']:
            if not user.is_authenticated:
                await self.send(json.dumps({"type": "error", "message": "Авторизуйтесь для голосования"}))
                return

            is_like = action == 'like'
            vote = await self.get_existing_vote(user, "main")
            if vote:
                if vote.is_like == is_like:
                    await self.send(json.dumps({"type": "error", "message": "Вы уже голосовали так"}))
                    return
                else:
                    await self.update_vote(vote, is_like)
                    await self.update_main_vote_counts(is_like, change=True)
            else:
                await self.save_vote(user, "main", is_like)
                await self.update_main_vote_counts(is_like, change=False)

            await self.channel_layer.group_send("likes_group", {"type": "broadcast_counts"})

        elif action == 'ping':
            await self.send_counts()

    async def broadcast_counts(self, event):
        await self.send_counts()

    @database_sync_to_async
    def get_existing_vote(self, user, content_id):
        from .models import Vote
        try:
            return Vote.objects.get(user=user, content_id=content_id)
        except Vote.DoesNotExist:
            return None

    @database_sync_to_async
    def save_vote(self, user, content_id, is_like):
        from .models import Vote
        Vote.objects.create(user=user, content_id=content_id, is_like=is_like)

    @database_sync_to_async
    def update_vote(self, vote, is_like):
        vote.is_like = is_like
        vote.save()

    @database_sync_to_async
    def update_main_vote_counts(self, is_like, change):
        from .models import MainVote
        main_vote, _ = MainVote.objects.get_or_create(id=1)
        if change:
            if is_like:
                main_vote.likes_count += 1
                main_vote.dislikes_count = max(main_vote.dislikes_count - 1, 0)
            else:
                main_vote.dislikes_count += 1
                main_vote.likes_count = max(main_vote.likes_count - 1, 0)
        else:
            if is_like:
                main_vote.likes_count += 1
            else:
                main_vote.dislikes_count += 1
        main_vote.save()

    @database_sync_to_async
    def get_counts_from_db(self):
        from .models import MainVote
        main_vote, _ = MainVote.objects.get_or_create(id=1)
        return main_vote.likes_count, main_vote.dislikes_count

    async def send_counts(self):
        likes, dislikes = await self.get_counts_from_db()
        await self.send(json.dumps({
            "type": "counts",
            "likes": likes,
            "dislikes": dislikes
        }))
