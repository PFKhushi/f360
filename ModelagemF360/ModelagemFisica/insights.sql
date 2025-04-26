SELECT * FROM equipes;

SELECT Nome_Usuario AS 'Integrantes do Projeto', Cargo, Status_Fabrica AS 'Status da Fábrica' FROM equipes INNER JOIN usuario WHERE equipes.ID_Usuario = usuario.ID_Usuario AND equipes.ID_Projeto = 1;
SELECT Nome_Usuario AS 'Integrantes do Projeto', Cargo, Status_Fabrica AS 'Status da Fábrica' FROM equipes INNER JOIN usuario WHERE equipes.ID_Usuario = usuario.ID_Usuario AND equipes.ID_Projeto = 2;

SELECT ID_Usuario as 'ID do usuário', Nome_Usuario as 'Nome dos Estudantes' FROM Usuario WHERE Tipo_Usuario in ('Imersionista', 'Extensionista');

SELECT Semestre_Imersao AS 'Semestre da Imersão', Nome_Usuario 
FROM imersao 
INNER JOIN participante, usuario 
WHERE participante.ID_Participante = imersao.ID_Participante AND participante.ID_Usuario = usuario.ID_Usuario;