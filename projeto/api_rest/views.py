from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Usuario
from .serializers import UsuarioSerializer
from django.shortcuts import get_object_or_404
# from .models import Usuarios
# from .serializers import UsuariosSerializer

# REGISTRO
# @api_view(['POST'])
# def register_user(request):
#     json = UsuariosSerializer(data=request.data)
#     if not json.is_valid():
#         return Response(json.errors, status=status.HTTP_400_BAD_REQUEST)
#     json.save()
#     return Response({"message": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)

#LOGIN, REQUISIÇÃO TOKEN
# @api_view(['POST'])
# def login_user(request):
#     email = request.data.get("username")
#     password = request.data.get("password")
    
#     print(email, password)

#     user = authenticate(request, username=email, password=password)

#     if user is not None:

#         refresh = RefreshToken.for_user(user)
#         return Response({
#             "refresh": str(refresh),
#             "access": str(refresh.access_token)
#         })
#     else:
#         return Response({"error": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

# PUXAR TODOS USUARIO
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_profile(request):
#     users = Usuarios.objects.all() 
#     json = UsuariosSerializer(users, many=True)  
#     return Response(json.data)  

# # EDIÇÃO DE USUSARIO
# @api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated])
# def manage_user_by_id(request, user_id):
#     user = Usuarios.objects.filter(id=user_id).first()

#     if user is None:
#         return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)


#     if request.method == 'GET':
#         json = UsuariosSerializer(user)
#         return Response(json.data)


#     elif request.method == 'PUT':
#         json = UsuariosSerializer(user, data=request.data, partial=True) 
#         if json.is_valid():
#             json.save()
#             return Response(json.data)
#         return Response(json.errors, status=status.HTTP_400_BAD_REQUEST)


#     elif request.method == 'DELETE':
#         user.delete()
#         return Response({"message": "Usuário deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT)


from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Usuario
from .serializers import UsuarioSerializer
from django.shortcuts import get_object_or_404

class UsuarioList(generics.ListAPIView):
    """Lista todos os usuários (apenas para administradores)"""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAdminUser]

class CriarUsuario(generics.CreateAPIView):
    """Endpoint para registro de novos usuários"""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        """Garante que a senha seja criptografada"""
        user = serializer.save()
        if 'password' in self.request.data:
            user.set_password(self.request.data['password'])
            user.save()

class LoginUsuario(generics.GenericAPIView):
    """Endpoint para autenticação JWT"""
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Valida credenciais e retorna tokens JWT"""
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UsuarioSerializer(user).data
            })
        return Response(
            {'error': 'Credenciais inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )

class EditarUsuario(generics.UpdateAPIView):
    """Endpoint para edição de usuários usando ID"""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Obtém usuário por ID"""
        obj = get_object_or_404(Usuario, id=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        return obj

class UsuarioAtual(generics.RetrieveAPIView):
    """
    Retorna dados do usuário logado, impedindo que o mesmo saiba o seu próprio ID, ficando apenas a disposição
    dos dev's/ADM
    """
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class AlterarSenha(generics.UpdateAPIView):
    """Endpoint seguro para alteração de senha"""
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        if not user.check_password(request.data.get('senha_atual')):
            return Response(
                {'error': 'Senha atual incorreta'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(request.data.get('nova_senha'))
        user.save()
        return Response({'message': 'Senha atualizada com sucesso'})

class LogoutUsuario(generics.GenericAPIView):
    """Invalidar token JWT (logout), e impede o reuso de tokens após logout"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout realizado com sucesso'})
        except Exception:
            return Response(
                {'error': 'Token inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
    