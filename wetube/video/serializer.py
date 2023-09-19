from rest_framework import serializers
from .models import *

class ViewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields=['username','avatar']

#сериализатор полной информации по видео
class VideoFullSerializer(serializers.ModelSerializer):
    avtor = ViewUserSerializer(read_only=True)
    dislike_count = serializers.IntegerField(read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    views_counter = serializers.IntegerField(read_only=True)
    date_view = serializers.CharField(read_only=True)
    class Meta:
        model = VideoModel
        fields = ('title','id','video','avtor','date_view','views_counter','description','title_image','date_public','like_count','dislike_count')
    
    


class VideoModelCUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoModel
        fields =['title','id','video','description','title_image','genre','status','avtor']

    def update(self, instance, validated_data):
        instance.title = validated_data['title']
        instance.video = validated_data['video']
        instance.description = validated_data['description']
        instance.title_image = validated_data['title_image']
        instance.genre = validated_data['genre']
        instance.status = validated_data['status']
        instance.save()
        return instance

#сериализатор сокращенной информации по видео
class VideoPreviewSerializer(serializers.ModelSerializer):
    views_counter = serializers.IntegerField(read_only=True)
    avtor = ViewUserSerializer()
    class Meta:
        model = VideoModel
        fields = ('title','id','avtor','video','views_counter','title_image','date_public',)

class HistoryRelationSerializer(serializers.ModelSerializer):
    video = VideoPreviewSerializer()
    views_counter = serializers.IntegerField(read_only=True)
    class Meta:
        model=ReatingVideoRelation
        fields=['video','views_counter']

#сериализатор сообщений к видео
class CommentVideoSerializer(serializers.ModelSerializer):
    avtor_name = serializers.CharField(read_only=True)
    avtor_img = serializers.CharField(read_only=True)
    is_owner = serializers.BooleanField(read_only=True,default=False)
    class Meta:
        model = CommentUser
        fields = ['comment','id','avtor_name','avtor_img','avtor','video','is_owner']
    def create(self, validated_data):
        return CommentUser.objects.create(comment=validated_data['comment'],
                                          video=validated_data['video'],
                                          avtor=validated_data['avtor'])
    def update(self, instance, validated_data):
        instance.user = validated_data['avtor']
        instance.comment = validated_data['comment']
        instance.save()
        return instance
    
    
class AvtorPlaylistSerialize(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields =['username','avatar']


class BasePlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayList
        fields = ('id','name','avtor','title_image')
    def create(self, validated_data):
        return PlayList.objects.create(**validated_data)

class PlaylistPreviewSerialize(serializers.ModelSerializer):
    avtor = AvtorPlaylistSerialize()
    class Meta:
        model = PlayList
        fields = ('id','name','avtor','title_image')

class PlayListFullSerializer(serializers.ModelSerializer):
    video = VideoPreviewSerializer(many=True)
    avtor = AvtorPlaylistSerialize()
    class Meta:
        model = PlayList
        fields = ('name','avtor','title_image','video','avtor')
