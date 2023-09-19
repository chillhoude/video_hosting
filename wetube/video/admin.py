from django.contrib import admin
from video.models import VideoModel,CommentUser,PlayList,Hashtags, ReatingVideoRelation,WatchLaterRelation

admin.site.register(VideoModel)

admin.site.register(CommentUser)

admin.site.register(PlayList)

admin.site.register(Hashtags)

admin.site.register(ReatingVideoRelation)
admin.site.register(WatchLaterRelation)