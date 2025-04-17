from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission): # 

    def has_object_permission(self, request, view, obj):
        return (request.user == obj.usuario or request.user.is_staff) and request.user.is_authenticated

class CanViewAllParticipantes(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user.has_perm('api_rest.ver_todos_participantes')
    
class CanViewAllEmpresas(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user.has_perm('api_rest.ver_todas_empresas')

class IsEmpresaOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_empresa

class IsTechLeaderOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_techleader

class IsAdminOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff and request.user.is_authenticated