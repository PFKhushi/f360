from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
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


from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from api_rest.serializers import UsuarioSerializer
from api_rest.models import Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UsuarioList(generics.ListAPIView):

    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):

        return Usuario.objects.all()
    
class CriarUsuario(generics.CreateAPIView):
    
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        
        password = serializer.validated_data.get('password')
        user = serializer.save()
        if password:
            user.set_password(password)
            user.save()
        
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        response_data = {
            'status': 'success',
            'user': serializer.data,
            'message': 'Usuário criado com sucesso!'
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
        

class LoginUsuario(generics.GenericAPIView):
    serializer_class = TokenObtainPairSerializer
    permission_classes = [AllowAny]  # Permitir que qualquer usuário faça login

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            return Response(
                {
                    "status": "success",
                    "message": "Login realizado com sucesso!",
                    "access": serializer.validated_data["access"],
                    "refresh": serializer.validated_data["refresh"],
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Credenciais inválidas."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    
class EditarUsuario(generics.UpdateAPIView):
    
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]  

    def get_object(self):
        username = self.kwargs.get("username")  
        user = get_object_or_404(Usuario, username=username)

        if self.request.user == user or self.request.user.is_staff:
            return user

        self.permission_denied(
            self.request,
            message="Você não tem permissão para modificar este usuário."
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)  
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {"status": "success", "message": "Usuário atualizado com sucesso!", "user": serializer.data},
            status=status.HTTP_200_OK
        )
    