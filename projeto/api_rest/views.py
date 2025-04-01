from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuarios
from .serializers import UsuariosSerializer

# REGISTRO
@api_view(['POST'])
def register_user(request):
    json = UsuariosSerializer(data=request.data)
    if not json.is_valid():
        return Response(json.errors, status=status.HTTP_400_BAD_REQUEST)
    json.save()
    return Response({"message": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)

#LOGIN, REQUISIÇÃO TOKEN
@api_view(['POST'])
def login_user(request):
    email = request.data.get("username")
    password = request.data.get("password")
    
    print(email, password)

    user = authenticate(request, username=email, password=password)

    if user is not None:

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
    else:
        return Response({"error": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

# PUXAR TODOS USUARIO
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    users = Usuarios.objects.all() 
    json = UsuariosSerializer(users, many=True)  
    return Response(json.data)  

# EDIÇÃO DE USUSARIO
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_user_by_id(request, user_id):
    user = Usuarios.objects.filter(id=user_id).first()

    if user is None:
        return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)


    if request.method == 'GET':
        json = UsuariosSerializer(user)
        return Response(json.data)

 
    elif request.method == 'PUT':
        json = UsuariosSerializer(user, data=request.data, partial=True) 
        if json.is_valid():
            json.save()
            return Response(json.data)
        return Response(json.errors, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == 'DELETE':
        user.delete()
        return Response({"message": "Usuário deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT)