# backend/leagues/admin.py
from django.contrib import admin
from .models import League, Player, Referral

@admin.register(League)
class LeagueAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner')
    search_fields = ('name',)

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'league', 'score')
    search_fields = ('name',)

@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referred_user', 'created_at')
    search_fields = ('referrer__username', 'referred_user__username')