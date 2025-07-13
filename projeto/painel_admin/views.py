from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def login_view(request):

    return render(request, 'painel_admin/login.html')

@login_required(login_url='/painel/login/')
def painel_view(request):

    return render(request, 'painel_admin/index.html')