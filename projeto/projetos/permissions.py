from rest_framework import permissions

class PodeAlterarProjeto(permissions.BasePermission):

    message = "Você não tem permissão para alterar este projeto."

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True

        if hasattr(request.user, 'techleader') and obj.techleader == request.user.techleader:
            return True

        if hasattr(request.user, 'empresa') and obj.empresa == request.user.empresa:
            return True

        return False
