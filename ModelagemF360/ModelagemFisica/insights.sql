SELECT * FROM dados_sensiveis;
SELECT * FROM usuarios;
SELECT * FROM extensionista;
SELECT * FROM imersionista;

-- 1. Procura o nome completo, curso, e-mail e o ID dos usuário que é extensionista:
SELECT Nome_Completo, Curso, Email, PK_ID_Usuario
FROM usuarios RIGHT JOIN dados_sensiveis 
ON usuarios.PK_ID_Usuario = dados_sensiveis.FK_ID_Usuario 
WHERE Tipo_de_Usuario ='Extensionista';

-- 2. Procura o nome completo, curso, área e o cargo do extensionista da fábrica que renovaram em 2025.01:
SELECT Nome_Completo, Curso, Area, Cargo
FROM usuarios RIGHT JOIN extensionista 
ON usuarios.PK_ID_Usuario = extensionista.FK_ID_Usuario
 WHERE Renovacao='Sim';

-- 3. Conta quantos novatos superaram as expectativas no workshop:
SELECT count(*)
FROM usuarios RIGHT JOIN extensionista 
ON usuarios.PK_ID_Usuario = extensionista.FK_ID_Usuario 
WHERE Cargo='Novato' AND Desempenho_Workshop='Superou expectativas';

-- 4. Procura o nome completo, 1ª e 2ª opção, tecnologias e o coments dos usuários que participaram do processo de imersão da fábrica:
SELECT Nome_Completo, Opcao_1 ,Opcao_2, Tecnologias, Coments 
FROM usuarios RIGHT JOIN imersionista 
ON usuarios.PK_ID_Usuario = imersionista.FK_ID_Usuario;

