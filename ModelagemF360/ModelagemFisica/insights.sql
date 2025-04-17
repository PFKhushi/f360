SELECT * FROM equipes;

SELECT Nome_Usuario AS 'Integrantes do Projeto', Cargo  FROM equipes INNER JOIN usuario WHERE equipes.ID_Usuario = usuario.ID_Usuario AND equipes.ID_Projeto = 1;
SELECT Nome_Usuario AS 'Integrantes do Projeto', Cargo  FROM equipes INNER JOIN usuario WHERE equipes.ID_Usuario = usuario.ID_Usuario AND equipes.ID_Projeto = 2;