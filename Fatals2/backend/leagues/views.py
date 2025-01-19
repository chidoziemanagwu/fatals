# backend/leagues/views.py
import json
from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
import stripe

from .models import League, Player
from .serializers import LeagueSerializer, PlayerSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get'])
    def rankings(self, request, pk=None):
        league = self.get_object()
        players = league.players.all()
        rankings = sorted(players, key=lambda p: p.score, reverse=True)
        return Response({'rankings': [player.name for player in rankings]})

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

@csrf_exempt
def create_checkout_session(request):
    if request.method == 'POST':
        YOUR_DOMAIN = "http://localhost:8000"
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'Fantasy Baseball Subscription',
                        },
                        'unit_amount': 2000,  # \$20.00
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '/success/',
            cancel_url=YOUR_DOMAIN + '/cancel/',
        )
        return JsonResponse({'id': checkout_session.id})


@api_view(['POST'])
@permission_classes([AllowAny])  # Add this decorator to allow unauthenticated access
@csrf_exempt
def register_user(request):
    try:
        # Debug incoming request
        print("Request method:", request.method)
        print("Request headers:", request.headers)
        print("Request body:", request.body.decode('utf-8'))

        # Parse the request data
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get('password')
        referral_code = data.get('referral_code')

        # Validate input
        if not username or not password:
            return Response(
                {'message': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'message': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create_user(
            username=username,
            password=password
        )

        # Generate token for the user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response(
            {
                'message': 'User registered successfully',
                'token': access_token,
                'username': username
            },
            status=status.HTTP_201_CREATED
        )

    except json.JSONDecodeError as e:
        print("JSON Decode Error:", str(e))
        return Response(
            {'message': 'Invalid JSON data'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        print("Registration Error:", str(e))
        return Response(
            {'message': f'Registration failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def analytics_view(request):
    permission_classes = [IsAuthenticated]

    total_leagues = League.objects.count()
    total_players = Player.objects.count()
    return Response({
        'total_leagues': total_leagues,
        'total_players': total_players,
    })




@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_user(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return Response({
                'success': False,
                'message': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'success': True,
                'message': 'Login successful',
                'token': str(refresh.access_token),
                'username': user.username,  # Ensure this is included
                'lastLogin': user.last_login.isoformat() if user.last_login else None  # Include last login
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

    except json.JSONDecodeError:
        return Response({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Login failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)