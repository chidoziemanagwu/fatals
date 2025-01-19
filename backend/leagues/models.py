from django.db import models
from django.contrib.auth.models import User

class League(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # Add a field to track the role of the user in the league
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('manager', 'Manager'), ('player', 'Player')], default='player')

    def __str__(self):
        return self.name

class Player(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=50)
    score = models.FloatField()
    league = models.ForeignKey(League, related_name='players', on_delete=models.CASCADE)
    accurate_position = models.CharField(max_length=50, blank=True, null=True)  # New field
    batting_average = models.FloatField(blank=True, null=True)  # New field
    home_runs = models.IntegerField(blank=True, null=True)  # New field
    rbis = models.IntegerField(blank=True, null=True)  # New field
    stolen_bases = models.IntegerField(blank=True, null=True)  # New field

    def __str__(self):
        return self.name
    
class Referral(models.Model):
    referrer = models.ForeignKey(User, related_name='referrals', on_delete=models.CASCADE)
    referred_user = models.ForeignKey(User, related_name='referred_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.referrer.username} referred {self.referred_user.username}"
    
