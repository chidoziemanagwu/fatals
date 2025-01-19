# backend/leagues/management/commands/import_advanced_stats.py
import requests
from django.core.management.base import BaseCommand
from leagues.models import Player

class Command(BaseCommand):
    help = 'Import advanced player statistics'

    def handle(self, *args, **kwargs):
        url = 'https://api.example.com/advanced_stats'  # Replace with actual API endpoint
        response = requests.get(url)
        data = response.json()

        for player_data in data:
            player, created = Player.objects.update_or_create(
                name=player_data['name'],
                defaults={
                    'batting_average': player_data.get('batting_average'),
                    'home_runs': player_data.get('home_runs'),
                    'rbis': player_data.get('rbis'),
                    'stolen_bases': player_data.get('stolen_bases'),
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully imported advanced statistics'))
    