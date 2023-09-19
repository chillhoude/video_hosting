from django.shortcuts import render

from .models import CustomUser,CommentCommunityModel
from video.models import VideoModel
from .serializer import *

from rest_framework.viewsets import ModelViewSet
from rest_framework.authtoken.models import Token
from django.db.models import Count
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action



class ViewUser(ModelViewSet):
    queryset=CustomUser.objects.all()
    serializer_class = UserPageSerializer
    def retrieve(self,request,*args,**kwargs):
        instance = CustomUser.objects.filter(username=kwargs['pk']).annotate(count_subscriber=Count('subscribers'))
        return Response(UserPageSerializer(instance,many=True).data)
    @action(detail=True,methods=['get'], url_path=r'video')
    def get_user(self,request,*args,**kwargs):
        video = VideoModel.objects.get(pk=kwargs['pk'])
        user = CustomUser.objects.filter(pk=video.avtor.pk).annotate(count_subscriber=Count('subscribers'))
        return Response(UserPreviewSerializer(user,many=True).data,)
    @action(detail=False,methods=['get'],url_path='me/preview')
    def get_preview_user(self,request,*args,**kwargs):
        user = CustomUser.objects.filter(username=request.user.username)
        return Response(UserPreviewSerializer(user,many=True).data)
    @action(detail=False,methods=['get'],url_path='auth/page')
    def get_auth_user_page(self,request,*args,**kwargs):
        instance = CustomUser.objects.filter(username=request.user.username).annotate(count_subscriber=Count('subscribers'))
        return Response(UserPageSerializer(instance,many=True).data)
    @action(detail=False,methods=['get'],url_path='settings/user')
    def get_settings_authuser(self,request,*args,**kwargs):
        instance = CustomUser.objects.filter(username=request.user.username)
        return Response(UserPageSettingsSerializer(instance,many=True).data)
    @action(detail=False,methods=['post'],url_path='set/user')
    def set_settings_authuser(self,request,*args,**kwargs):
        instance = CustomUser.objects.get(username=request.user.username)
        serializer = UserPageSettingsSerializer(data=request.data,instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    

class CommentCommunityView(ModelViewSet):
    queryset = CommentCommunityModel.objects.all()
    serializer_class = CommentCommunityBaseSerializer
    def put(self,request,*args,**kwargs):
        instance = CommentCommunityModel.objects.get(pk=kwargs['pk'])
        serializer = CommentCommunityBaseSerializer(data=request.data,instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    def post(self,request,*args,**kwargs):
        serializer = CommentCommunityBaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    def delete(self,request,*args,**kwargs):
        instance = CommentCommunityModel.objects.get(pk=kwargs['pk'])
        instance.delete()
    @action(detail=False,methods=['get'],url_path=r'user/(?P<username>\w+)')
    def get_CommentCommunity_user(self,request,*args,**kwargs):
        instance = CommentCommunityModel.objects.filter(avtor__username = kwargs['username'])
        return Response(CommentCommunityViewSerializer(instance,many=True).data)


def auth_user(request,user):
    return render(request,'user/auth_user_page.html')

def user_page(request,**kwargs):
    return render(request,'user/user_page.html')

def login_user(request):
    return render(request,'user/login.html')

def register_user(request):
    return render(request,'user/register.html')

def settings_user(request,username):
    return render(request,'user/settings.html')
 