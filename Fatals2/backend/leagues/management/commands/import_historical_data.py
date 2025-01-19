# backend/leagues/management/commands/import_historical_data.py
from django.core.management.base import BaseCommand
import requests
from leagues.models import Player

class Command(BaseCommand):
    help = 'Import historical player data'

    def handle(self, *args, **kwargs):
        # Example URL for historical data
        url = 'https://api.example.com/historical_data'  # Replace with actual API endpoint
        response = requests.get(url)

        if response.status_code != 200:
            self.stdout.write(self.style.ERROR('Failed to fetch data from the API'))
            return

        data = response.json()

        for player_data in data:
            # Assuming player_data contains 'name', 'batting_average', 'home_runs', etc.
            player, created = Player.objects.update_or_create(
                name=player_data['name'],
                defaults={
                    'batting_average': player_data.get('batting_average'),
                    'home_runs': player_data.get('home_runs'),
                    'rbis': player_data.get('rbis'),
                    'stolen_bases': player_data.get('stolen_bases'),
                    # Add other fields as necessary
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully imported historical data'))