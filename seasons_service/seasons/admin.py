from django.contrib import admin
from .models import Season, MainVote, Vote

@admin.register(MainVote)
class MainVoteAdmin(admin.ModelAdmin):
    readonly_fields = ('likes_count', 'dislikes_count')
    list_display = ('likes_count', 'dislikes_count')

    class Media:
        js = ('js/reload.js',)

admin.site.register(Season)
admin.site.register(Vote)
