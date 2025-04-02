from rest_framework import serializers
from api_rest.models import Usuario
# from .models import Usuarios
# class UsuariosSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Usuarios
#         fields = "__all__"
        
#     def create(self, validated_data):
#         password = validated_data.pop('password')
#         user = Usuarios(**validated_data)
#         user.set_password(password)
#         user.save()
#         return user
        
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"