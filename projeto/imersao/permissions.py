from rest_framework import permissions

class PodeCRUDDesempenho(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        
        if request.user.is_staff:
            return True
        
        participante = obj.workshop.instrutor == request.user.participante.extensionista
        extensionista = obj.workshop.instrutor == request.user.excecao.extensionista
        return participante or extensionista
        
