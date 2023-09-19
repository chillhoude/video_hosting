from django.db import models
from django.utils import timezone
from django.conf import settings
from .rename_file import *
from users.models import CustomUser
from .word_appart.requrements import requeremets


class VideoModel(models.Model):
    status_Video = (('Open','Open'),
                    ('On link','On link'),
                    ('Close','Close'))
    genre_video = (('Game','Game'),
                   ('Travel','Travel'),
                   ('News','News'),
                   ('Music','Music'),
                   ('Trailer','Trailer'))
    title = models.CharField(max_length=150)
    description = models.TextField()
    avtor = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='avtor_video')
    genre = models.CharField(max_length=100,choices=genre_video)
    status = models.CharField(choices=status_Video,max_length=50)
    date_public = models.DateTimeField(default=timezone.now)
    video = models.FileField(upload_to=RenameFile())
    title_image = models.ImageField("Title image",upload_to=RenameFile())
    watch_later = models.ManyToManyField(CustomUser,through='WatchLaterRelation',related_name='watch_later_rel')
    reating = models.ManyToManyField(CustomUser,through='ReatingVideoRelation',related_name='likes')
    def __str__(self):
        return self.title
    def save(self,*args,**kwargs):
        super().save(*args, **kwargs)
        heshtag = Hashtags.objects.filter(video=self.pk)
        heshtag.delete()
        for el in requeremets(self.description):
            Hashtags.objects.create(video=self, hashtag=el)
            


class ReatingVideoRelation(models.Model):
    user = models.ForeignKey(CustomUser,to_field='id',on_delete=models.CASCADE,related_name='user_set_reating')
    video = models.ForeignKey(VideoModel,on_delete=models.CASCADE,related_name='video_reating')
    date_viewed = models.DateTimeField(auto_now_add=True)
    date_reating = models.DateTimeField(blank=True,null=True)
    is_like = models.BooleanField(blank=True,default=False)
    is_dislike = models.BooleanField(blank=True,default=False)
    
class WatchLaterRelation(models.Model):
    user = models.ForeignKey(CustomUser,to_field='id',on_delete=models.CASCADE)
    video = models.ForeignKey(VideoModel,on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)


class MusicCharts(models.Model):
    video = models.ManyToManyField(VideoModel)
    index = models.FloatField()

class GameTop(models.Model):
    video = models.ManyToManyField(VideoModel)
    index = models.FloatField()

class Trends(models.Model):
    video = models.ManyToManyField(VideoModel)
    index = models.FloatField()


class Hashtags(models.Model):
    video = models.ForeignKey('VideoModel',on_delete=models.CASCADE)
    hashtag = models.CharField(max_length=150)
    def __str__(self):
        return self.hashtag

class PlayList(models.Model):
    STATUS_PL = (('Open','Open'),
                 ('On link','On link'),
                 ('Close','Close'))
    title_image = models.ImageField("Title image",blank=True,upload_to='playlists/')
    name = models.CharField(max_length=100)
    video = models.ManyToManyField(VideoModel,blank=True)
    avtor = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    status = models.CharField(choices=STATUS_PL,max_length=20)
    user_saved = models.ManyToManyField(settings.AUTH_USER_MODEL,related_name='saved',blank=True)

    def save(self,*args,**kwargs):
        super().save(*args, **kwargs)
        if len(self.video.all())  != 0:
            self.title_image = self.video.first().title_image
    def __str__(self):
        return self.name

class CommentUser(models.Model):
    comment = models.TextField()
    date_public = models.DateTimeField(default=timezone.now)
    video = models.ForeignKey(VideoModel,on_delete=models.CASCADE)
    avtor = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.avtor} оставил коментарий {self.comment}'