CREATE SCHEMA `FabricaSoftware1`;

use `FabricaSoftware1`;

/* Modelagem do Banco de Dadoss - Lógico V2 - F360: */

CREATE TABLE Projetos (
    ID_Projeto INT PRIMARY KEY,
    Data_Prazo DATE,
    Nome_do_Projeto VARCHAR(255),
    FK_ID_Extensionista INT,
    FK_ID_Tech_Leader INT,
    Nome_Cliente VARCHAR(255)
);

CREATE TABLE Usuarios (
    PK_ID_Usuario INT PRIMARY KEY,
    Nome_Completo VARCHAR(255),
    Curso VARCHAR(255),
    Período INT,
    Telefone VARCHAR(30),
    Tipo_de_Usuario VARCHAR(255)
);

CREATE TABLE Extensionista (
    Renovacao ENUM('Sim', 'Não'),
    Desempenho_Workshop TEXT,
    Observacao_sobre_Desempenho TEXT,
    Cargo ENUM('Novato', 'Veterano'),
    PK_ID_Extensionista INT PRIMARY KEY,
    FK_ID_Usuario INT,
    Frequencia_Workshop TINYINT,
    Area VARCHAR(255),
    Especialidade VARCHAR(255),
    RGM VARCHAR(10),
    Email_Instituicional VARCHAR(255),
    Data_Renovacao DATE
);

CREATE TABLE Dados_Sensiveis (
    CPF VARCHAR(20),
    Senha VARCHAR(255),
    Email VARCHAR(255),
    FK_ID_Usuario INT,
    PK_ID_Dados_Sensiveis INT PRIMARY KEY
);

CREATE TABLE Imersionista (
    PK_ID_Imersionista INT PRIMARY KEY,
    FK_ID_Usuario INT,
    Opcao_1 VARCHAR(120),
    Opcao_2 VARCHAR(120),
    Tecnologias TEXT,
    PO TINYINT,
    GP TINYINT,
    AnaliseRequisitos TINYINT,
    Front_end TINYINT,
    ui_ux TINYINT,
    back TINYINT,
    Banco_de_Dados TINYINT,
    Jogos TINYINT,
    QA TINYINT,
    Mobile TINYINT,
    Analise_de_Dados TINYINT,
    Dev_RPA TINYINT,
    Artista_2D TINYINT,
    Coments TEXT,
    Projetos TEXT,
    Mudar_Projetos TEXT,
    Experiencia TEXT,
    Django_Python VARCHAR(30),
    Spring_Java VARCHAR(30),
    Laravel_PHP VARCHAR(30),
    HTML_CSS_JS VARCHAR(30),
    Unity VARCHAR(30),
    Next_js_React VARCHAR(30),
    Angular_Typescript VARCHAR(30),
    Node_js VARCHAR(30),
    Net_C_sharp VARCHAR(30),
    Bibliotecas_IA VARCHAR(30),
    Docker_ou_VM VARCHAR(30),
    GIT VARCHAR(30),
    Deploy VARCHAR(30),
    React_Native_Flutter VARCHAR(30),
    PostgreSQL_MySQL VARCHAR(30),
    Figma_Prototipacao VARCHAR(30),
    Bibliotecas_de_ML  VARCHAR(30)
);

CREATE TABLE Instrutor_Workshop (
    PK_ID_Instrutor INT PRIMARY KEY,
    FK_ID_Extensionista INT
);

CREATE TABLE Administrador (
    PK_ID_Administrador INT PRIMARY KEY
);

CREATE TABLE Tech_Leader (
    PK_ID_Tech_Leader INT PRIMARY KEY
);

-- Estabelecendo chaves Estrangeiras
ALTER TABLE Projetos ADD foreign key (FK_ID_Extensionista) references Extensionista(PK_ID_Extensionista);
ALTER TABLE Projetos ADD foreign key (FK_ID_Tech_Leader) references Tech_Leader(PK_ID_Tech_Leader);
ALTER TABLE Extensionista ADD foreign key (FK_ID_Usuario) references Usuarios(PK_ID_Usuario);
ALTER TABLE Dados_Sensiveis ADD foreign key (FK_ID_Usuario) references Usuarios(PK_ID_Usuario);
ALTER TABLE Imersionista ADD foreign key (FK_ID_Usuario) references Usuarios(PK_ID_Usuario);
ALTER TABLE Instrutor_Workshop ADD foreign key (FK_ID_Extensionista) references Extensionista(PK_ID_Extensionista);
