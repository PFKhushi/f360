-- 1. Listar todos os usuários com seus tipos e se possuem dados sensíveis registrados

SELECT u.ID_Usuario, u.Nome_Completo, u.Tipo_Usuario,
       ds.Email_Institucional, ds.Telefone, ds.CPF
FROM Usuario u
LEFT JOIN DadoSensivel ds ON u.ID_Usuario = ds.ID_DadosSensiveis;

-- 2. Buscar todos os participantes, seus cursos, períodos, e áreas de interesse

SELECT u.Nome_Completo, p.Curso, p.Periodo,
       af.Nome_Area, ai.Nota
FROM Participante p
JOIN Formulario f ON p.ID_Participante = f.ID_Participante
JOIN AreaInteresse ai ON ai.ID_Perfil = f.ID_Perfil
JOIN AreaFabrica af ON ai.ID_Area_Fabrica = af.ID_Area_Fabrica
JOIN Usuario u on p.ID_Usuario = u.ID_Usuario;

-- 3. Listar participantes, seus workshops, desempenho e classificação

SELECT u.Nome_Completo, w.Area, dw.Nota, dw.Classificacao_Nivel, dw.Especialidade
FROM DesempenhoWorkshop dw
JOIN Participante p ON dw.ID_Participante = p.ID_Participante
JOIN Usuario u ON p.ID_Usuario = u.ID_Usuario
JOIN Workshop w ON dw.ID_Workshop = w.ID_Workshop;

-- 4. Ver presenças em workshops com o conteúdo abordado

SELECT u.Nome_Completo, w.Area, pw.Dia, pw.Conteudo, pw.Presenca
FROM PresencaWorkshop pw
JOIN Participante p ON pw.ID_Participacao = p.ID_Participante
JOIN Usuario u ON p.ID_Usuario = u.ID_Usuario
JOIN Workshop w ON pw.ID_Workshop = w.ID_Workshop;

-- 5. Listar palestras realizadas em cada imersão e presenças dos participantes

SELECT pl.Nome_Palestra, pl.Palestrante, pp.Dia, u.Nome_Completo, pp.Presenca
FROM PresencaPalestra pp
JOIN Palestra pl ON pp.ID_Palestra = pl.ID_Palestra
JOIN Participante p ON pp.ID_Participante = p.ID_Participante
JOIN Usuario u ON p.ID_Usuario = u.ID_Usuario;

-- 6. Ver quais participantes estiveram em quais imersões

SELECT u.Nome_Completo, i.Semestre, i.Ano
FROM ParticipacaoImersao pi
JOIN Participante p ON pi.ID_Participante = p.ID_Participante
JOIN Usuario u ON p.ID_Usuario = u.ID_Usuario
JOIN Imersao i ON pi.ID_Imersao = i.ID_Imersao;

-- 7. Listar extensionistas com detalhes de avaliação

SELECT u.Nome_Completo, e.Nota, e.Comentario
FROM Extensionista ext
JOIN Excecao e ON ext.ID_Excecao = e.ID_Excecao
JOIN Participante p ON ext.ID_Participante = p.ID_Participante
JOIN Usuario u ON p.ID_Usuario = u.ID_Usuario;


-- 8. Listar tecnologias cadastradas no formulário dos participantes

SELECT u.Nome_Completo, tf.Nome_Tecnologia, tfm.Nivel_Conhecimento
FROM TecnologiaFormulario tfm
JOIN TecnologiaFabrica tf ON tfm.ID_Tecnologia_Fabrica = tf.ID_Tecnologia_Fabrica
JOIN Formulario f ON tfm.ID_Perfil = f.ID_Perfil
JOIN Participante p ON f.ID_Participante = p.ID_Participante
JOIN Usuario u ON p.ID_Usuario = u.ID_Usuario;

-- 9. Ver histórico de alterações realizadas no sistema

SELECT u.Nome_Completo, l.Tabela_Alterada, l.Campos_Alterado, l.Dados_Anteriores, l.Dados_Novos, l.Data_Alteracao, l.Operacoes
FROM LogEntry l
JOIN Usuario u ON l.ID_Usuario = u.ID_Usuario
ORDER BY l.Data_Alteracao DESC;
