from rest_framework import serializers
from .models import CustomUser,CommentCommunityModel

class UserPageSerializer(serializers.ModelSerializer):
    count_subscriber = serializers.IntegerField()
    class Meta:
        model = CustomUser
        fields=['username','avatar','count_subscriber']

class UserPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['id','username','avatar']

class UserPageSettingsSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(allow_empty_file=True,required=False)
    class Meta:
        model = CustomUser
        fields =['username','first_name','last_name','avatar','email','bio','id']

    def update(self, instance, validated_data):
        if validated_data['first_name'] != 'null':
            instance.first_name = validated_data['first_name']
        if validated_data['last_name'] != 'null':
            instance.last_name = validated_data['last_name']
        if validated_data['bio'] != 'null':
            instance.bio = validated_data['bio']
        instance.username = validated_data['username']
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']
        instance.email = validated_data['email']
        instance.save()
        return instance

class CommentCommunityViewSerializer(serializers.ModelSerializer):
    avtor = UserPreviewSerializer(read_only=True)
    class Meta:
        model = CommentCommunityModel
        fields= ['avtor','image','text']

class CommentCommunityBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentCommunityModel
        fields= ['avtor','image','text','id']
    def create(self, validated_data):
        print(validated_data)
        return CommentCommunityModel.objects.create(**validated_data)
    def update(self, instance, validated_data):
        instance.text = validated_data['text']
        instance.image = validated_data['image']
        instance.save()
        return instance