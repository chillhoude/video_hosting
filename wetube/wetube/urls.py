from django.contrib import admin
from django.urls import path, re_path, include
from django.conf.urls.static import static

from . import settings
from video.views import *
from users.views import *

from rest_framework import routers

router_video = routers.SimpleRouter()
router_video.register(r'api/video',VideoView,basename='VideoModel')
router_user = routers.SimpleRouter()
router_video.register(r'api/user',ViewUser,basename='CustomUser')
router_playlist = routers.SimpleRouter()
router_playlist.register(r'api/playlist',PlaylistView,basename='Playlist')
router_commentcommunity = routers.SimpleRouter()
router_commentcommunity.register(r'api/commentcommunity',CommentCommunityView,basename='CommentCommunityModel')
roueter_videoobjective = routers.SimpleRouter()
roueter_videoobjective.register(r'video/list',VideoObjectiveView)


urlpatterns = [
    path('admin/', admin.site.urls),
    #login backend
    re_path(r'^auth/', include('djoser.urls.authtoken')),
    re_path(r'^auth/', include('djoser.urls')),
    #backend video
    path('api/comment/<int:pk>/',CommentVideoView.as_view()),
    #frontend
    path('',main_page),
    
    path('change/<pk>/',change_video_page),
    path('feed/history/',feed_history),
    path('feed/library/',feed_library),
    path('feed/trends/',feed_trends),
    path('feed/games/',feed_games),
    path('feed/music/',feed_music),
    path('feed/news/',feed_news),
    path('tab/history/',history_page),
    path('tab/library/',tab_library),
    path('tab/watch-later/',tab_watchLater),
    path('tab/my-video/',tab_myVideo),
    path('playlist/<int:pk>/',playlist_page),
    path('<int:pk>/',detail_video),
    re_path(r'^search=([а-я]|[А-Я])',search_video),
    re_path(r'^search=([a-z]|[A-Z]+)',search_video),
    
    path('video/create/',create_video_page),
    # user 
    path('user/<username>/',user_page),
    path('settings/<username>/',settings_user),
    re_path(r'^me/([a-z]|[A-Z]+)',auth_user),
    path('login/',login_user),
    path('register/',register_user),

]

urlpatterns += router_video.urls
urlpatterns += router_user.urls
urlpatterns += router_playlist.urls
urlpatterns += router_commentcommunity.urls
urlpatterns += roueter_videoobjective.urls

urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)