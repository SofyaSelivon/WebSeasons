from django.urls import path
from . import views
from .views import feedback_view
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('api/mainvote_counts/', views.mainvote_counts, name='mainvote_counts'),
    path('api/feedback/', feedback_view, name='feedback'),
    path('', views.index, name='index'),
    path('<str:season_name>/', views.season_view, name='season_view'),
] + static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
