from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import AnonymousUser
from users.models import CustomUser
from rest_framework import generics
from django.db.models import F,Q ,Count,Case,When,Value
from django.utils import timezone
from rest_framework.response import Response

from rest_framework import filters
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token

from .models import VideoModel, CommentUser,Hashtags,PlayList,ReatingVideoRelation
from users.models import CustomUser
from .permission_classes import IsOwnerOrReadOnly

from .serializer import *


class VideoView(ModelViewSet):
    serializer_class = VideoFullSerializer
    filter_backends = [filters.SearchFilter]
    search_fields=['title'] 
    queryset = VideoModel.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    def list(self,request,*args, **kwargs):
        print(request.user)
        # если user не авторизирован
        if request.user == AnonymousUser():
            instance = VideoModel.objects.all().select_related('avtor').annotate(views_counter=Count(F('video_reating__date_viewed')),)
            serialize = VideoPreviewSerializer(instance, many=True)
            return Response(serialize.data)
        # если user авторизирован
        else:
            instance = VideoModel.objects.all().select_related('avtor').annotate(views_counter=Count(F('video_reating__date_viewed')))
            serialize = VideoPreviewSerializer(instance, many=True)
            return Response(serialize.data)

    def retrieve(self, request, *args, **kwargs):
        instance = VideoModel.objects.select_related('avtor').prefetch_related('reating').filter(pk=kwargs['pk']).annotate(
                                                                                               like_count = Count(Case(When(video_reating__is_like=True,then=1))),
                                                                                               dislike_count=Count(Case(When(video_reating__is_dislike=True,then=1))),
                                                                                               views_counter=Count(F('video_reating__date_viewed')),)
        video_pk = VideoModel.objects.get(pk=kwargs['pk'])
        react_active = False
        if request.user.__class__ == CustomUser:
            for user in video_pk.reating.all():
                if user == request.user:
                    react_active = True
            if not react_active:
                video_pk.reating.add(request.user)
            else:
                user_reating = ReatingVideoRelation.objects.get(user=request.user,video_id=kwargs['pk'])
                user_reating.date_viewed = timezone.now()
                user_reating.save()
                    
        serialize = VideoFullSerializer(instance,many=True)
        return Response(serialize.data)
    def create(self, request, *args, **kwargs): 
        pass
    def update(self, request, *args, **kwargs):
        pass
    def destroy(self, request, *args, **kwargs):
        pass

    @action(detail=True, methods=["get"], url_path=r'sc')
    def same_content(self,request, *args, **kwargs):
        videos = []
        video = VideoModel.objects.get(pk=kwargs['pk'])
        # хештеги по главному видео
        for el in Hashtags.objects.filter(video=kwargs['pk']):
            for i in Hashtags.objects.filter(hashtag=el):
                if int(i.video.pk) != int(kwargs['pk']) and int(i.video.pk) not in videos: 
                    videos.append(i.video.pk)

        video_sc = VideoModel.objects.filter(Q(genre=video.genre) | Q(pk__in=videos)).select_related('avtor').annotate(owner_username=F('avtor__username'))
        serialize = VideoPreviewSerializer(video_sc, many=True)
        return Response(serialize.data)
    # добавить лайк
    @action(detail=True,methods=["post"],url_path=r'like')
    def add_like(self,request, *args, **kwargs):
        reating = ReatingVideoRelation.objects.get(user=request.user,video=kwargs['pk'])
        context={'context':''}
        if reating.is_dislike:
            reating.is_dislike = False
            reating.is_like = True
            reating.date_reating = timezone.now()
            context = {'context':'plus like,minus dislike'}
        elif reating.is_like:
            reating.is_like = False
            context = {'context':'minus like'}
        else:
            reating.is_like = True
            reating.date_reating = timezone.now()
            context = {'context':'plus like'}
        reating.save()
        return Response(data=context)
    # добавить дизлайк
    @action(detail=True,methods=["post"],url_path=r'dislike')
    def add_dislike(self,request, *args, **kwargs):
        reating = ReatingVideoRelation.objects.get(user=request.user,video__id=kwargs['pk'])
        context={'context':''}
        if reating.is_dislike:
            reating.is_dislike = False
            context = {'context':'minus dislike'}
        elif reating.is_like:
            reating.is_like = False
            reating.is_dislike = True
            context = {'context':'minus like,plus dislike'}
        else:
            reating.is_dislike = True
            context = {'context':'plus dislike'}
        reating.save()
        return Response(data=context)
    # фильтрация по новым видео пользователя
    @action(detail=False,methods=['get'],url_path=r'new/(?P<username>\w+)')
    def new_user_video(self,request, *args, **kwargs):
        instance = VideoModel.objects.filter(avtor__username=kwargs['username']).select_related('avtor').order_by('-date_public').annotate(views_counter=Count(F('video_reating__date_viewed')),)
        return Response(VideoPreviewSerializer(instance, many=True).data)
    # фильрация по самым популярным видео пользователя
    @action(detail=False,methods=['get'],url_path=r'popular/(?P<username>\w+)')
    def popular_user_video(self,request, *args, **kwargs):
        instance = VideoModel.objects.filter(avtor__username=kwargs['username']).select_related('avtor').annotate(views_counter=Count(F('video_reating__date_viewed')),)
        return Response(VideoPreviewSerializer(instance, many=True).data)
    # история пользователя
    @action(detail=False,methods=['get'],url_path='like')
    def get_auth_user_likedvideo(self,request,*args,**kwargs):
        
        instance = ReatingVideoRelation.objects.filter(Q(user=request.user) & Q(is_like=True)).order_by('-date_reating').annotate(views_counter=Count('video__video_reating__date_viewed'))
        return Response(HistoryRelationSerializer(instance, many=True).data)
    @action(detail=False,methods=['get'],url_path='watch-later')
    def get_auth_user_watchlatervideo(self,request,*args,**kwargs):
        instance = VideoModel.objects.filter(watch_later=request.user).select_related('avtor').annotate(views_counter=Count('video_reating__date_viewed')).order_by('-watchlaterrelation__date')
        return Response(VideoPreviewSerializer(instance, many=True).data)
    @action(detail=False,methods=['get'],url_path='history')
    def get_auth_user_history(self,request,*args,**kwargs):
        
        instance = ReatingVideoRelation.objects.filter(user=request.user).order_by('-date_viewed').annotate(views_counter=Count('video__video_reating__date_viewed'))
        return Response(HistoryRelationSerializer(instance, many=True).data)
    @action(detail=True,methods=['get'],url_path='change')
    def get_video_change(self,requst,*args,**kwargs):
        video = VideoModel.objects.get(pk=kwargs['pk'])
        serializer = VideoModelCUDSerializer(video)
        return Response(serializer.data)
    @action(detail=True,methods=['post'],url_path='change')
    def set_video_change(self,requst,*args,**kwargs):
        video = VideoModel.objects.get(pk=kwargs['pk'])
        serializer = VideoModelCUDSerializer(data=requst.data,instance=video)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    @action(detail=True,methods=['post'],url_path='watch-later')
    def addWatchLater(self,requset,*args,**kwargs):
        video = VideoModel.objects.get(pk=kwargs['pk'])
        if len(video.watch_later.all()) == 0:
            video.watch_later.add(requset.user)
        else:
            for el in video.watch_later.all():
                if requset.user == el:
                    video.watch_later.remove(requset.user)
                    print('remove')
                else:
                    video.watch_later.add(requset.user)

        
        return Response(status=status.HTTP_200_OK)
       
    
class PlaylistView(ModelViewSet):
    serializer_class = BasePlaylistSerializer
    queryset = PlayList.objects.all()
    def get(self, request, *args, **kwargs):
        pass
    def delete(self, request, *args, **kwargs):
        pass
    def retrieve(self, request, *args, **kwargs):
        instance = PlayList.objects.filter(pk=kwargs['pk'])
        serializer=PlayListFullSerializer(instance,many=True)
        return Response(serializer.data)
    def post(self, request, *args, **kwargs):
        request.data["avtor"]=request.user.id
        serializer = BasePlaylistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    @action(detail=False,methods=['get'],url_path=r'user-playlist/(?P<username>\w+)')
    def popular_user_playlist(self,request, *args, **kwargs):
        instance = PlayList.objects.filter(avtor__username=kwargs['username'],status='Open').select_related('avtor')
        return Response(PlaylistPreviewSerialize(instance, many=True).data)
    @action(detail=True,methods=['post'],url_path=r'update-video')
    def update_video_playlist(self, request, *args, **kwargs):
        instance = PlayList.objects.get(pk=kwargs['pk'])
        video = VideoModel.objects.get(pk=request.data['video'])
        video_added = False
        for video_playlist in instance.video.all():
            if video_playlist.id == video.id:
                video_added = True
        
        if video_added == False:
            instance.video.add(video)
        else:
            instance.video.remove(video)
        instance.save
        return Response(status=status.HTTP_200_OK)
    @action(detail=False,methods=['get'],url_path=r'owner/(?P<username>\w+)')
    def get_user_owner_playlists(self, request, *args, **kwargs):
        instance = PlayList.objects.filter(avtor__username = kwargs['username']).annotate()
        serializer = PlaylistPreviewSerialize(instance,many=True)
        return Response(serializer.data)
    @action(detail=True,methods=['post'],url_path=r'save/(?P<username>\w+)')
    def set_usersave_playlist(self, request, *args, **kwargs):
        instance = PlayList.objects.get(pk=kwargs['pk'])
        for user in instance.user_saved.all():
            if user == request.user:
                instance.user_saved.remove(request.user)
            else:
                instance.user_saved.add(request.user)
        return Response(status=status.HTTP_200_OK)
    @action(detail=False,methods=['get'],url_path=r'reqeust-user')
    def get_request_user_playlists(self, request, *args, **kwargs):
        instance = PlayList.objects.filter(avtor = request.user)
        serializer = BasePlaylistSerializer(instance,many=True)
        return Response(serializer.data)
    @action(detail=False,methods=['get'],url_path='saved-playlist')
    def get_auth_user_savedplaylist(self,request,*args,**kwargs):
        instance = PlayList.objects.filter(Q(avtor=request.user) | Q(user_saved=request.user) & Q(status='Open'))
        return Response(PlaylistPreviewSerialize(instance, many=True).data)

class CommentVideoView(generics.DestroyAPIView,
                       generics.ListCreateAPIView,
                       generics.UpdateAPIView):
    serializer_class = CommentVideoSerializer
    permission_classes = [IsOwnerOrReadOnly]
    def get(self, request, *args, **kwargs):
        if request.user == AnonymousUser():
            instance = CommentUser.objects.filter(video=kwargs['pk']).select_related('avtor').order_by('-date_public').annotate(avtor_name=F('avtor__username'),
                                                                                                   avtor_img=F('avtor__avatar'),)
        else:
            instance = CommentUser.objects.filter(video=kwargs['pk']).select_related('avtor').order_by('-date_public').annotate(avtor_name=F('avtor__username'),
                                                                                                   avtor_img=F('avtor__avatar'),
                                                                                                   is_owner = Case(When(avtor=request.user,then=Value(True)),default=Value(False)))
        serializer = CommentVideoSerializer(instance,many=True)
        return Response(serializer.data)

    def put(self,request,*args,**kwargs):
        request.data['avtor'] = request.user.id
        instance = CommentUser.objects.get(pk=kwargs['pk'])
        serializer = CommentVideoSerializer(data=request.data,instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'comment':request.data['comment']})

    def post(self, request, *args, **kwargs):
        request.data['avtor'] = request.user.id
        request.data['video'] = kwargs['pk']
        serialier = CommentVideoSerializer(data=request.data)
        serialier.is_valid(raise_exception=True)
        serialier.save()
        return Response({'response':{'avtor_name':request.user.username,'avtor_img':str(request.user.avatar),'comment':serialier.data['comment']}})
    def delete(self,request, *args, **kwargs):
        instance = CommentUser.objects.get(pk=kwargs['pk'])
        instance.delete()
        return Response(status=status.HTTP_200_OK)



def main_page(request):
    return render(request,'video/main.html')

def history_page(request):
    return render(request,'video/history.html')
def library_page(request):
    return render(request,'video/library.html')

def detail_video(request,pk):
    return render(request,'video/video.html')

def search_video(request,identifier):
    return render(request,'video/search_video.html')

def feed_history(request):
    return render(request,'video/feed_history.html')

def feed_library(request):
    return render(request,'video/feed_library.html')

def feed_trends(request):
    return render(request,'video/feed_trends.html')
def feed_games(request):
    return render(request,'video/feed_games.html')
def feed_music(request):
    return render(request,'video/feed_music.html')
def feed_news(request):
    return render(request,'video/feed_news.html')

def change_video_page(request,pk):
    return render(request,'video/change_video.html')

def playlist_page(request,pk):
    return render(request,'video/playlist.html')