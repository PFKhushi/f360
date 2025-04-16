# from django.test import TestCase
# from django.contrib.auth import authenticate

# # Create your tests here.

# from django.test import TestCase
# from django.contrib.auth import get_user_model
# from django.core.exceptions import ValidationError
# from django.db import IntegrityError, transaction
# from django.contrib.auth.models import AnonymousUser
# from django.urls import reverse
# from django.test import Client




# # Testando manager de usuário
# #class UsuarioManagerTests(TestCase):
#     """Testes para o gerenciador personalizado de usuários (UsuarioManager)."""
    
#     #def setUp(self):
#         self.User = get_user_model()
#         self.user_data = {
#             'nome': 'Usuário Teste',
#             'cpf': '12345678901',
#             'username': 'usuario@teste.com',
#             'email_institucional': 'usuario@institucional.com',
#             'rgm': '12345678',
#             'password': 'senha_segura123'
#         }
    
#     # TESTE CRIAR USUÁRIO
#     def test_criar_usuario(self): 
        
#         usuario = self.User.objects.create_user(**self.user_data)
#         self.assertEqual(usuario.nome, self.user_data['nome'])
#         self.assertEqual(usuario.cpf, self.user_data['cpf'])
#         self.assertEqual(usuario.username, self.user_data['username'])
#         self.assertEqual(usuario.email_institucional, self.user_data['email_institucional'])
#         self.assertEqual(usuario.rgm, self.user_data['rgm'])
        
#         self.assertTrue(usuario.check_password(self.user_data['password']))
        
#         self.assertFalse(usuario.is_staff)     #Falso
#         self.assertFalse(usuario.is_superuser) # Falso
#         self.assertTrue(usuario.is_active)     # Verdadeiro  
    
#     # TEST CRIAR SUPER USUÁRIO
#     def test_criar_superusuario(self):
#         admin = self.User.objects.create_superuser(
#             nome=self.user_data['nome'],
#             username=self.user_data['username'],
#             password=self.user_data['password']
#         )
#         self.assertEqual(admin.nome, self.user_data['nome'])
#         self.assertEqual(admin.username, self.user_data['username'])
#         self.assertTrue(admin.check_password(self.user_data['password']))
#         self.assertEqual(admin.cpf, '00000000000')  # Valor padrao para admin
#         self.assertEqual(admin.rgm, '00000000')  # Valor padrao para admn
#         self.assertEqual(admin.email_institucional, self.user_data['username'])  # Valor padrao para admin
#         self.assertTrue(admin.is_staff)     # True
#         self.assertTrue(admin.is_superuser) # True
#         self.assertTrue(admin.is_active)    # True
    
    
#     def test_erro_criar_usuario_sem_username(self):
        
#         self.user_data['username'] = ''
        
#         with self.assertRaises(ValueError):
#             self.User.objects.create_user(**self.user_data)
    
#     def test_criar_usuario_sem_nome(self):
#         self.user_data['nome'] = ''
#         with self.assertRaises(ValueError):
#             self.User.objects.create_user(**self.user_data)
    
#     def test_criar_usuario_sem_cpf(self):
#         self.user_data['cpf'] = ''
#         with self.assertRaises(ValueError):
#             self.User.objects.create_user(**self.user_data)
            
#     def test_criar_usuario_sem_rgm(self):
#         self.user_data['rgm'] = ''
#         with self.assertRaises(ValueError):
#             self.User.objects.create_user(**self.user_data)

#     def test_criar_usuario_sem_email_institucional(self):
#         self.user_data['email_institucional'] = ''
#         with self.assertRaises(ValueError):
#             self.User.objects.create_user(**self.user_data)
    
#     def test_criar_superusuario_com_flags_invalidas(self):

#         # Teste is_staff=False
#         with self.assertRaises(ValueError):
#             self.User.objects.create_superuser(
#                 nome=self.user_data['nome'],
#                 username=self.user_data['username'],
#                 password=self.user_data['password'],
#                 is_staff=False
#             )
        
#         # Teste is_superuser=False
#         with self.assertRaises(ValueError):
#             self.User.objects.create_superuser(
#                 nome=self.user_data['nome'],
#                 username=self.user_data['username'],
#                 password=self.user_data['password'],
#                 is_superuser=False
#             )
        
#         # Teste is_active=False
#         with self.assertRaises(ValueError):
#             self.User.objects.create_superuser(
#                 nome=self.user_data['nome'],
#                 username=self.user_data['username'],
#                 password=self.user_data['password'],
#                 is_active=False
#             )
    
#     def test_get_by_natural_key(self):

#         # Verifica se get_by_natural_key implementado
#         user = self.User.objects.create_user(**self.user_data)
        
#         try:
#             found_user = self.User.objects.get_by_natural_key(self.user_data['username'])
#             self.assertEqual(user.pk, found_user.pk)
#         except AttributeError:
#             self.fail("O método get_by_natural_key não está implementado ou está incorreto")
    
#     # Testa criar dois usuários com o mesmo noeme        
#     def test_unique_nome(self):
#         self.User.objects.create_user(
#             nome="Teste", cpf="12345678901",
#             username="teste1@teste.com", email_institucional="inst1@teste.com", rgm="11111111",
#             password="senha123"
#         )
        
#         with self.assertRaises(IntegrityError):
#             self.User.objects.create_user(
#                 nome="Teste", cpf="12345678991",  # Mesmo nome
#                 username="teste2@teste.com", email_institucional="inst2@teste.com", rgm="22222222",
#                 password="senha456"
#             )
                
#     # Testa criar dois usuários com o mesmo CPF
#     def test_unique_cpf(self):
#         self.User.objects.create_user(
#             nome="Teste", cpf="12345678901",
#             username="teste1@teste.com", email_institucional="inst1@teste.com", rgm="11111111",
#             password="senha123"
#         )
        
#         with self.assertRaises(IntegrityError):
#             self.User.objects.create_user(
#                 nome="Outro Teste", cpf="12345678901",  # Mesmo CPF
#                 username="teste2@teste.com", email_institucional="inst2@teste.com", rgm="22222222",
#                 password="senha456"
#             )
    
#     # Testa criar dois usuários com o mesmo username
#     def test_unique_username(self):
#         self.User.objects.create_user(
#             nome="Teste", cpf="12345678901",
#             username="teste1@teste.com", email_institucional="inst1@teste.com", rgm="11111111",
#             password="senha123"
#         )
        
#         with self.assertRaises(IntegrityError):
#             self.User.objects.create_user(
#                 nome="Outro Teste", cpf="12345670901",  # Mesmo username
#                 username="teste1@teste.com", email_institucional="inst2@teste.com", rgm="22222222",
#                 password="senha456"
#             )
    
#     # Testa criar dois usuários com o mesmo email institucional
#     def test_unique_email_institucional(self):
#         self.User.objects.create_user(
#             nome="Teste", cpf="12345678901",
#             username="teste1@teste.com", email_institucional="inst1@teste.com", rgm="11111111",
#             password="senha123"
#         )
        
#         with self.assertRaises(IntegrityError):
#             self.User.objects.create_user(
#                 nome="Outro Teste", cpf="12345578901",  # Mesmo email_instu
#                 username="teste2@teste.com", email_institucional="inst1@teste.com", rgm="22222222",
#                 password="senha456"
#             )
                
    
#     # Testa criar dois usuários com o mesmo RGM
#     def test_unique_rgm(self):
#         self.User.objects.create_user(
#             nome="Teste", cpf="12345678901",
#             username="teste1@teste.com", email_institucional="inst1@teste.com", rgm="11111111",
#             password="senha123"
#         )
        
#         with self.assertRaises(IntegrityError):
#             self.User.objects.create_user(
#                 nome="Outro Teste", cpf="12345278901",  # Mesmo CPF
#                 username="teste2@teste.com", email_institucional="inst2@teste.com", rgm="11111111",
#                 password="senha456"
#             )

# # Testando modelo de usuario
# class UsuarioModelTests(TestCase):
    
#     def setUp(self):
#         self.User = get_user_model()
#         self.user_data = {
#             'nome': 'Usuário Teste',
#             'cpf': '12345678901',
#             'username': 'usuario@teste.com',
#             'email_institucional': 'usuario@institucional.com',
#             'rgm': '12345678',
#             'password': 'senha_segura123'
#         }
#         self.user = self.User.objects.create_user(**self.user_data)
    
    
#     def test_representacao_str(self):
#         expected_str = f"{self.user.nome} - {self.user.rgm}"
#         self.assertEqual(str(self.user), expected_str)
    
    
    
#     def test_validators(self):
#         # Teste CPF inválido
#         user = self.User(
#             nome='Usuário Validador',
#             cpf='1234',  # Formato inválido
#             username='validador@teste.com',
#             email_institucional='validador@institucional.com',
#             rgm='12345678'
#         )
#         with self.assertRaises(ValidationError):
#             user.full_clean()
            
#         # Teste RGM inválido
#         user = self.User(
#             nome='Usuário Validador',
#             cpf='12345678901',
#             username='validador@teste.com',
#             email_institucional='validador@institucional.com',
#             rgm='1234'  # Formato inválido
#         )
#         with self.assertRaises(ValidationError):
#             user.full_clean()
    
    
#     def test_valores_padroes(self):
#         self.assertTrue(self.user.is_active)
#         self.assertFalse(self.user.is_staff)
#         self.assertFalse(self.user.is_bolsista)
#         self.assertFalse(self.user.is_estagiario)
#         self.assertEqual(self.user.genero, self.User.Genero.NAO_INFORMADO)


# class UsuarioAuthenticationTests(TestCase):
    
#     def setUp(self):
#         self.User = get_user_model()
#         self.user_data = {
#             'nome': 'Usuário Teste',
#             'cpf': '12345678901',
#             'username': 'usuario@teste.com',
#             'email_institucional': 'usuario@institucional.com',
#             'rgm': '12345678',
#             'password': 'senha_segura123'
#         }
#         self.user = self.User.objects.create_user(**self.user_data)
#         self.user.is_active = True 
#         self.user.save()
#         self.client = Client()
    
#     def test_login(self):        
#         login_url = reverse('logar_usuario')  
#         response = self.client.post(login_url, {
#             'username': self.user_data['username'],
#             'password': self.user_data['password'],
#         })
#         self.assertEqual(response.status_code, 200)  

#         authenticated_user = authenticate(
#             username=self.user_data['username'],
#             password=self.user_data['password']
#         )
#         self.assertIsNotNone(authenticated_user)
#         self.assertEqual(authenticated_user.pk, self.user.pk)
    
#     def test_permissoes_superuser(self):
#         admin = self.User.objects.create_superuser(
#             nome='Admin Teste',
#             username='admin@teste.com',
#             password='admin_senha123'
#         )
#         self.assertTrue(admin.is_superuser)
#         self.assertTrue(admin.has_perm('auth.add_permission')) 