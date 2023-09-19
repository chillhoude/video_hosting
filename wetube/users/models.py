from django.db import models
from django.contrib.auth.models import UserManager
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from .manager import CustomUserManager
from django.utils import timezone

class CustomUser(AbstractBaseUser,PermissionsMixin):
    username = models.CharField(_("username"),max_length=20,unique=True)
    first_name = models.CharField(_("Фамилия"), max_length=50,null=True, blank=True)
    last_name = models.CharField(_("Имя"), max_length=50,null=True, blank=True)
    avatar = models.ImageField(_("Аватарка"),upload_to='media/avatar',default='avatar/user.png')
    email = models.EmailField(_("email address"), blank=True,null=True)
    subscribers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='Fans')
    subscriptions = models.ManyToManyField(settings.AUTH_USER_MODEL)
    bio = models.TextField(blank=True,null=True)
    is_moderator = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
        )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
        )
    is_superuser = models.BooleanField(
        _("superuser status"),
        default=False,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
        )
    is_active = models.BooleanField(
        _("active"),
        default=False,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
    )
    )
    objects = CustomUserManager()
    
    date_joined = models.DateTimeField(
        _("date joined"),
        default=timezone.now
        )
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    class Meta:
        verbose_name= 'User'
        verbose_name_plural= 'User'
    def __str__(self):
        return self.username

class CommentCommunityModel(models.Model):
    avtor = models.ForeignKey(CustomUser,blank=True,on_delete=models.CASCADE)
    text = models.TextField()
    image = models.ImageField(upload_to=f'usermassage/{avtor}/{timezone.now()}',blank=True)