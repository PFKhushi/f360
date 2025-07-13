
from rest_framework.routers import DefaultRouter
from .views import ProjetoViewSet

router = DefaultRouter()

router.register('projeto', ProjetoViewSet, basename='projeto')

urlpatterns = []
urlpatterns += router.urls  