# backend/leagues/tests.py
from django.test import TestCase
from .models import League, Player

class LeagueModelTest(TestCase):
    def setUp(self):
        self.league = League.objects.create(name='Test League')

    def test_league_creation(self):
        self.assertEqual(self.league.name, 'Test League')