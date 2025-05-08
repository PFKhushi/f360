-- 1. Tabela Usuario
CREATE TABLE Usuario (
    ID_Usuario SERIAL PRIMARY KEY,
    Nome_Completo VARCHAR(255) NOT NULL,
    Tipo_Usuario VARCHAR(50) NOT NULL CHECK (Tipo_Usuario IN ('Imersionista', 'Extensionista', 'Instrutor de Workshop', 'Tech Leader', 'Administrador'))
);

-- 2. Tabela Participante
CREATE TABLE Participante (
    ID_Participante SERIAL PRIMARY KEY,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario),
    Curso VARCHAR(255) NOT NULL,
    Periodo SMALLINT NOT NULL
);

-- 3. Tabela Workshop
CREATE TABLE Workshop (
    ID_Workshop SERIAL PRIMARY KEY,
    Area VARCHAR(100) NOT NULL
);

-- 4. Tabela DesempenhoWorkshop
CREATE TABLE DesempenhoWorkshop (
    ID_Desempenho_Workshop SERIAL PRIMARY KEY,
    ID_Participante INT REFERENCES Participante(ID_Participante),
    ID_Workshop INT REFERENCES Workshop(ID_Workshop),
    Nota VARCHAR(50) CHECK (Nota IN ('Superou expectativas', 'Acima da Média', 'Atendeu todos os requisitos', 'Atendeu parcialmente os requisitos', 'Não atendeu os requisitos', 'Não entregou o desafio')),
    Comentario TEXT,
    Especialidade VARCHAR(100),
    Classificacao_Nivel VARCHAR(20) CHECK (Classificacao_Nivel IN ('Trainee', 'Júnior', 'Pleno', 'Sênior'))
);

-- 5. Tabela PresencaWorkshop
CREATE TABLE PresencaWorkshop (
    ID_Presenca_Workshop SERIAL PRIMARY KEY,
    ID_Participacao INT REFERENCES Participante(ID_Participante),
    ID_Workshop INT REFERENCES Workshop(ID_Workshop),
    Presenca BOOLEAN,
    Dia DATE,
    Conteudo VARCHAR(255)
);

-- 6. Tabela Imersao
CREATE TABLE Imersao (
    ID_Imersao SERIAL PRIMARY KEY,
    Semestre VARCHAR(20) NOT NULL,
    Ano INT NOT NULL
);

-- 7. Tabela Formulario
CREATE TABLE Formulario (
    ID_Perfil SERIAL PRIMARY KEY,
    ID_Imersao INT REFERENCES Imersao(ID_Imersao),
    ID_Participante INT REFERENCES Participante(ID_Participante),
    Primeira_Opçao VARCHAR(100) NOT NULL,
    Segunda_Opçao VARCHAR(100) NOT NULL,
    Experiencia_previa TEXT
);

-- 8. Tabela AreaFabrica
CREATE TABLE AreaFabrica (
    ID_Area_Fabrica SERIAL PRIMARY KEY,
    Nome_Area VARCHAR(100) NOT NULL,
    Status_Area VARCHAR(10) NOT NULL CHECK (Status_Area IN ('Ativo', 'Inativo'))
);

-- 9. Tabela AreaInteresse
CREATE TABLE AreaInteresse (
    ID_Area_Interesse SERIAL PRIMARY KEY,
    ID_Area_Fabrica INT REFERENCES AreaFabrica(ID_Area_Fabrica),
    ID_Perfil INT REFERENCES Formulario(ID_Perfil),
    Nota SMALLINT NOT NULL CHECK (Nota BETWEEN 1 AND 5)
);

-- 10. Tabela TecnologiaFabrica
CREATE TABLE TecnologiaFabrica (
    ID_Tecnologia_Fabrica SERIAL PRIMARY KEY,
    Nome_Tecnologia VARCHAR(100) NOT NULL,
    Status_Tecnologia VARCHAR(10) NOT NULL CHECK (Status_Tecnologia IN ('Ativo', 'Inativo'))
);

-- 11. Tabela TecnologiaFormulario
CREATE TABLE TecnologiaFormulario (
    ID_Tecnologia_Formulario SERIAL PRIMARY KEY,
    ID_Tecnologia_Fabrica INT REFERENCES TecnologiaFabrica(ID_Tecnologia_Fabrica),
    ID_Perfil INT REFERENCES Formulario(ID_Perfil),
    Nivel_Conhecimento VARCHAR(20) NOT NULL CHECK (Nivel_Conhecimento IN ('Trainner', 'Júnior', 'Pleno', 'Sênior'))
);

-- 12. Tabela Palestra
CREATE TABLE Palestra (
    ID_Palestra SERIAL PRIMARY KEY,
    Nome_Palestra VARCHAR(255) NOT NULL,
    Palestrante VARCHAR(255) NOT NULL
);

-- 13. Tabela PresencaPalestra
CREATE TABLE PresencaPalestra (
    ID_Presenca_Palestra SERIAL PRIMARY KEY,
    ID_Palestra INT REFERENCES Palestra(ID_Palestra),
    ID_Participante INT REFERENCES Participante(ID_Participante),
    Presenca BOOLEAN NOT NULL,
    Dia DATE NOT NULL
);

-- 14. Tabela ParticipacaoImersao
CREATE TABLE ParticipacaoImersao (
    ID_ParticipacaoImersao SERIAL PRIMARY KEY,
    ID_Imersao INT REFERENCES Imersao(ID_Imersao),
    ID_Participante INT REFERENCES Participante(ID_Participante)
);

-- 15. Tabela Excecao
CREATE TABLE Excecao (
    ID_Excecao SERIAL PRIMARY KEY,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario),
    Comentario VARCHAR(255),
    Nota VARCHAR(50) NOT NULL
);

-- 16. Tabela Extensionista
CREATE TABLE Extensionista (
    ID_Extensionista SERIAL PRIMARY KEY,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario),
	Data_Inicio DATE NOT NULL,
	Ultima_Renovacao DATE NOT NULL
);

-- 17. Tabela LogEntry
CREATE TABLE LogEntry (
    ID_Logs SERIAL PRIMARY KEY,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario),
    Tabela_Alterada VARCHAR(100) NOT NULL,
    Campos_Alterado VARCHAR(255) NOT NULL,
    Dados_Anteriores TEXT NOT NULL,
    Dados_Novos TEXT NOT NULL,
    Data_Alteracao DATE NOT NULL,
    Operacoes VARCHAR(50) NOT NULL
);

-- 18. Tabela Empresa
CREATE TABLE Empresa (
    ID_Empresa SERIAL PRIMARY KEY,
    Nome_Empresa VARCHAR(255) NOT NULL,
    CNPJ BIGINT NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Telefone BIGINT NOT NULL,
    Representante VARCHAR(255) NOT NULL
);

-- 19- Tabela Tech Leader:
CREATE TABLE Tech_Leader (
    ID_Tech_Leader SERIAL PRIMARY KEY,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario)
);

-- 19. Tabela Projeto
CREATE TABLE Projeto (
    ID_Projeto SERIAL PRIMARY KEY,
    Nome_Projeto VARCHAR(255) NOT NULL,
    Descricao TEXT NOT NULL,
    Area_Relacionada VARCHAR(100),
    Progresso VARCHAR(100),
    Prazo_Entrega DATE,
    Status VARCHAR(20) CHECK (Status IN ('Ativo', 'Inativo', 'Atrasado')),
    EtapaAtual VARCHAR(100),
    Observacoes_Internas TEXT,
    Data_Prazo DATE NOT NULL,
    ID_Empresa INT REFERENCES Empresa(ID_Empresa),
	ID_Tech_Leader INT REFERENCES Tech_Leader(ID_Tech_Leader)
);

-- 20. Tabela Equipe
CREATE TABLE Equipe (
    ID_Alocacao SERIAL,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario),
    ID_Projeto INT REFERENCES Projeto(ID_Projeto) NOT NULL,
    Cargo VARCHAR(100) NOT NULL,
    Status_Fabrica VARCHAR(10) NOT NULL CHECK (Status_Fabrica IN ('novato', 'veterano')),
    PRIMARY KEY (ID_Alocacao, ID_Usuario)
);

-- 21. Tabela DadoSensivel
CREATE TABLE DadoSensivel (
    ID_DadosSensiveis SERIAL PRIMARY KEY,
    Email_Institucional VARCHAR(255) NOT NULL,
    Telefone BIGINT NOT NULL,
    Codigo INT NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    CPF BIGINT NOT NULL
);


-- 23- Tabela Instrutor Workshop:
CREATE TABLE Instrutor_Workshop(
	ID_Instrutor_Workshop SERIAL PRIMARY KEY,
	ID_Extensionista INT REFERENCES Extensionista(ID_Extensionista), 
	ID_Workshop INT REFERENCES Workshop(ID_Workshop)
	
);

-- Inserção de dados na tabela Usuario
INSERT INTO Usuario (Nome_Completo, Tipo_Usuario) VALUES
('Ana Beatriz Silva', 'Imersionista'),
('Carlos Eduardo Souza', 'Extensionista'),
('Mariana Lima', 'Instrutor de Workshop'),
('Pedro Henrique Alves', 'Tech Leader'),
('Lucca de Sena Barbosa', 'Administrador');

-- Inserção de dados na tabela Participante (usuários 1, 2 e 5 são participantes)
INSERT INTO Participante (ID_Usuario, Curso, Periodo) VALUES
(1, 'Ciência da Computação', 3),
(2, 'Engenharia de Software', 5),
(5, 'Sistemas de Informação', 7);

-- Inserção de dados na tabela Imersao
INSERT INTO Imersao (Semestre, Ano) VALUES
('2025.1', 2025),
('2025.2', 2025);

-- Inserção de dados na tabela Formulario
INSERT INTO Formulario (ID_Imersao, ID_Participante, Primeira_Opçao, Segunda_Opçao, Experiencia_previa) VALUES
(1, 1, 'Dados', 'Back-End', 'Experiência com projetos de análise de dados e dashboards.'),
(1, 2, 'Back-End', 'Dados', 'Desenvolvimento de APIs REST em Java.');

-- Inserção de dados na tabela Workshop
INSERT INTO Workshop (Area) VALUES
('Dados'),
('Back-End'),
('Front-End'),
('UI-UX Designer');

-- Inserção de dados na tabela DesempenhoWorkshop (ID_Participante e ID_Workshop válidos)
INSERT INTO DesempenhoWorkshop (ID_Participante, ID_Workshop, Nota, Comentario, Especialidade, Classificacao_Nivel) VALUES
(1, 1, 'Superou expectativas', 'Excelente performance em Python.', 'Python/Django', 'Júnior'),
(2, 2, 'Atendeu todos os requisitos', 'Boa entrega no projeto final.', 'Java/Spring', 'Pleno'),
(1, 4, 'Atendeu parcialmente os requisitos', 'Boa evolução, mas precisa melhorar em UX.', 'Figma/Design', 'Júnior');

-- Inserção de dados na tabela PresencaWorkshop
-- OBS: A tabela ParticipacaoImersao deve ser inserida antes, pois define ID_Participacao
INSERT INTO ParticipacaoImersao (ID_Imersao, ID_Participante) VALUES
(1, 1),
(1, 2),
(2, 2);

-- Agora sim, PresencaWorkshop (supondo que ID_Participacao é incremental: 1, 2, 3)
INSERT INTO PresencaWorkshop (ID_Participacao, ID_Workshop, Presenca, Dia, Conteudo) VALUES
(1, 1, TRUE, '2025-04-10', 'Introdução a Python'),
(1, 1, TRUE, '2025-04-11', 'Manipulação de Dados com Pandas'),
(2, 2, FALSE, '2025-04-10', 'Introdução ao Spring Boot');

-- Inserção de dados na tabela Empresa
INSERT INTO Empresa (Nome_Empresa, CNPJ, Senha, Email, Telefone, Representante) VALUES
('Tech Solutions', 12345678000199, 'senha123', 'contato@techsolutions.com', 83999998888, 'João Silva'),
('InovaSoft', 98765432000111, 'senha456', 'suporte@inovasoft.com', 83988887777, 'Maria Fernanda');

-- Inserção de dados na tabela Projeto
INSERT INTO Projeto (Nome_Projeto, Descricao, Area_Relacionada, Progresso, Prazo_Entrega, Status, EtapaAtual, Observacoes_Internas, Data_Prazo, ID_Empresa) VALUES
('Sistema de Gerenciamento de Imersão', 'Sistema para controle de workshops e imersões.', 'Dados', '50%', '2025-12-31', 'Ativo', 'Desenvolvimento', 'Aguardando integração com API.', '2025-12-31', 1),
('Plataforma de Cursos Online', 'Portal para hospedagem de cursos.', 'Back-End', '30%', '2025-11-15', 'Ativo', 'Planejamento', 'Necessário definir requisitos.', '2025-11-15', 2);

-- Inserção de dados na tabela Equipe
INSERT INTO Equipe (ID_Usuario, ID_Projeto, Cargo, Status_Fabrica) VALUES
(2, 1, 'Desenvolvedor Backend', 'novato'),
(4, 1, 'Tech Leader', 'veterano'),
(1, 2, 'Analista de Dados', 'novato'),
(4, 2, 'Tech Leader', 'veterano');

-- Inserção de dados na tabela Palestra
INSERT INTO Palestra (Nome_Palestra, Palestrante) VALUES
('Tendências de Dados 2025', 'Dr. Joana Dantas'),
('Boas práticas em Desenvolvimento Web', 'Eng. Rafael Costa');

-- Inserção de dados na tabela PresencaPalestra
INSERT INTO PresencaPalestra (ID_Palestra, ID_Participante, Presenca, Dia) VALUES
(1, 1, TRUE, '2025-04-12'),
(2, 2, TRUE, '2025-04-13'),
(1, 2, FALSE, '2025-04-12');

-- Inserção de dados na tabela AreaFabrica
INSERT INTO AreaFabrica (Nome_Area, Status_Area) VALUES
('Dados', 'Ativo'),
('Back-End', 'Ativo'),
('Front-End', 'Ativo');

-- Inserção de dados na tabela TecnologiaFabrica
INSERT INTO TecnologiaFabrica (Nome_Tecnologia, Status_Tecnologia) VALUES
('Python/Django', 'Ativo'),
('Java/Spring', 'Ativo'),
('ReactJS', 'Ativo');

-- Inserção de dados na tabela AreaInteresse (ID_Perfil == ID_Participante assumido)
INSERT INTO AreaInteresse (ID_Area_Fabrica, ID_Perfil, Nota) VALUES
(1, 1, 5),
(2, 1, 4),
(2, 2, 5),
(1, 2, 3);

-- Inserção de dados na tabela TecnologiaFormulario
INSERT INTO TecnologiaFormulario (ID_Tecnologia_Fabrica, ID_Perfil, Nivel_Conhecimento) VALUES
(1, 1, 'Pleno'),
(2, 2, 'Pleno'),
(3, 1, 'Júnior');

-- Inserção de dados na tabela DadoSensivel
INSERT INTO DadoSensivel (Email_Institucional, Telefone, Codigo, Senha, Email, CPF) VALUES
('ana.beatriz@fabrica.com', 83911112222, 1001, 'senhaAna123', 'ana.beatriz@gmail.com', 12345678901),
('carlos.eduardo@fabrica.com', 83922223333, 1002, 'senhaCarlos123', 'carlos.eduardo@gmail.com', 22345678901),
('mariana.lima@fabrica.com', 83933334444, 1003, 'senhaMariana123', 'mariana.lima@gmail.com', 32345678901),
('pedro.henrique@fabrica.com', 83944445555, 1004, 'senhaPedro123', 'pedro.henrique@gmail.com', 42345678901),
('lucca.barbosa@fabrica.com', 83955556666, 1005, 'senhaLucca123', 'lucca.barbosa@gmail.com', 52345678901);

-- Inserção de dados na tabela Excecao
INSERT INTO Excecao (ID_Usuario, Comentario, Nota) VALUES
(2, 'Participante indicado para extensão devido ao ótimo desempenho.', 'Excelente'),
(1, 'Participante avaliado para possível extensão.', 'Bom');

-- Inserção de dados na tabela Extensionista

INSERT INTO Extensionista (ID_Extensionista, ID_Usuario, Data_Inicio, Ultima_Renovacao) VALUES
(1, 2, '2020-02-20', '2025-02-20'),
(2, 1, '2022-09-20', '2024-02-20');

-- Inserção de dados na tabela LogEntry
INSERT INTO LogEntry (ID_Usuario, Tabela_Alterada, Campos_Alterado, Dados_Anteriores, Dados_Novos, Data_Alteracao, Operacoes) VALUES
(5, 'Projeto', 'Status', 'Ativo', 'Atrasado', '2025-04-20', 'UPDATE'),
(5, 'Usuario', 'Nome_Completo', 'Mariana Lima', 'Mariana L. Silva', '2025-04-21', 'UPDATE');