INSERT INTO usuarios VALUES(1, "Lucca de Sena Barbosa", "Ciências da Computação", 3, "83991270090", "Extensionista");
INSERT INTO dados_sensiveis VALUES("111.111.111-11", "abcdefgh", "lucca123@gmail.com", 1, 1);

INSERT INTO usuarios VALUES
(2, "João da Silva", "Engenharia de Software", 2, "83998765432", "Extensionista"),
(3, "Maria Oliveira", "Sistemas de Informação", 4, "83991234567", "Imersionista"),
(4, "Carlos Santos", "Engenharia da Computação", 1, "83992345678", "Imersionista"),
(5, "Ana Souza", "Ciência de Dados", 5, "83993456789", "Extensionista"),
(6, "Paulo Almeida", "Computação Gráfica", 3, "83994567890", "Imersionista"),
(7, "Fernanda Costa", "Inteligência Artificial", 2, "83995678901", "Imersionista"),
(8, "Ricardo Lima", "Redes de Computadores", 4, "83996789012", "Tech Leader"),
(9, "Juliana Rocha", "Engenharia de Software", 3, "83997890123", "Extensionista"),
(10, "Gustavo Mendes", "Segurança da Informação", 2, "83998901234", "Extensionista");

INSERT INTO dados_sensiveis VALUES
("222.222.222-22", "ijklmnop", "joao.silva@email.com", 2, 2),
("333.333.333-33", "qrstuvwx", "maria.oliveira@email.com", 3, 3),
("444.444.444-44","yzabcdef", "carlos.santos@email.com", 4, 4),
("555.555.555-55", "ghijklmn", "ana.souza@email.com", 5, 5),
("666.666.666-66", "opqrstuv", "paulo.almeida@email.com", 6, 6),
("777.777.777-77", "wxyzabcd", "fernanda.costa@email.com", 7, 7),
("888.888.888-88", "efghijkl", "ricardo.lima@email.com", 8, 8),
("999.999.999-99", "mnopqrst", "juliana.rocha@email.com", 9, 9),
("000.000.000-00", "uvwxyzab", "gustavo.mendes@email.com", 10, 10);


INSERT INTO extensionista VALUES
("Sim", "Atendeu todos os requisitos", "Ótima Organização de Código", "Novato", 1, 1, 7, "Banco de Dados", "Python", "11111111", "lucca.barbosa@cs.unipe.edu.br", '2025.02.28'),
("Não", "Superou expectativas", "Conseguiu atuar muito bem no front-end, conseguindo tornar o site responsívo", "Veterano",2, 2, 6, "Back-End", "Django", "22222222", "joao.silva@cs.unipe.edu.br", '2025.02.28'),
("Sim", "Superou expectativas", "Trouxe uma solução inesperada com modelos de Machine Learning", "Novato", 3, 5, 7, "Banco de Dados", "Linguagem R", "33333333", "ana.souza@cs.unipe.edu.br", '2024.02.28'),
("Sim", "Acima da Média", "Ponto forte em lógica de programação", "Veterano", 4, 9, 6, "Jogos", "Unity", "44444444", "juliana.rocha@cs.unipe.edu.br", '2024.02.28'),
("Sim", "Atendeu todos os requisitos", "Desafio entregue de maneira clara e objetiva", "Novato", 5, 10, 5, "Front-end", "Node.js", "55555555", "gustavo.mendes@cs.unipe.edu.br", '2023.02.28');


select * from imersionista;

INSERT INTO `imersionista`(
    `PK_ID_Imersionista`, `FK_ID_Usuario`, `Opcao_1`, `Opcao_2`, `Tecnologias`, 
    `PO`, `GP`, `AnaliseRequisitos`, `Front_end`, `ui_ux`, `back`, `Banco_de_Dados`, 
    `Jogos`, `QA`, `Mobile`, `Analise_de_Dados`, `Dev_RPA`, `Artista_2D`, 
    `Coments`, `Projetos`, `Mudar_Projetos`, `Experiencia`, 
    `Django_Python`, `Spring_Java`, `Laravel_PHP`, `HTML_CSS_JS`, `Unity`, `Next_js_React`, 
    `Angular_Typescript`, `Node_js`, `Net_C_sharp`, `Bibliotecas_IA`, `Docker_ou_VM`, `GIT`, `Deploy`, 
    `React_Native_Flutter`, `PostgreSQL_MySQL`, `Figma_Prototipacao`, `Bibliotecas_de_ML`
) VALUES
(2, 2, 'Banco de Dados', 'Back-end', 'Foco em modelagem e otimização de queries', 
 2, 1, 4, 1, 2, 5, 5, 1, 2, 1, 3, 1, 1, 
 'Especialista em SQL e modelagem de dados.', 'Projetos de otimização.', 'Aprendendo NoSQL.', 'SÊNIOR', 
 'SÊNIOR', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'SÊNIOR', 'Nenhuma', 'PLENO', 'SÊNIOR', 'SÊNIOR', 'SÊNIOR', 'Nenhuma', 'SÊNIOR', 'Nenhuma', 'Nenhuma'),

(3, 3, 'Front-End', 'UI/UX', 'Especializado em React e design de interfaces', 
 1, 1, 2, 5, 5, 3, 2, 1, 2, 1, 2, 1, 1, 
 'Experiência com React e Figma.', 'Projetos de design de interface.', 'Migrando para UX Research.', 'PLENO', 
 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'Nenhuma', 'SÊNIOR', 'JÚNIOR', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'PLENO', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma'),

(4, 4, 'Back-End', 'Banco de Dados', 'Foco em APIs e PostgreSQL', 
 1, 2, 3, 2, 2, 5, 4, 1, 2, 1, 3, 1, 1, 
 'Especialista em REST APIs e bancos de dados.', 'Projetos com Django.', 'Explorando GraphQL.', 'SÊNIOR', 
 'SÊNIOR', 'JÚNIOR', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'Nenhuma', 'Nenhuma', 'SÊNIOR', 'SÊNIOR', 'SÊNIOR', 'Nenhuma', 'PLENO', 'Nenhuma', 'Nenhuma'),

(5, 5, 'QA', 'Análise de Requisitos', 'Testes automatizados e estratégias de qualidade', 
 1, 4, 5, 1, 2, 2, 2, 1, 5, 1, 2, 1, 1, 
 'Experiência com testes automatizados.', 'Projetos de qualidade de software.', 'Aprofundando CI/CD.', 'PLENO', 
 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'JÚNIOR', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma'),

(6, 6, 'Jogos', 'Front-End', 'Especializado em desenvolvimento de jogos 2D', 
 1, 1, 2, 4, 3, 2, 1, 5, 2, 1, 2, 1, 5, 
 'Desenvolvimento de jogos 2D.', 'Projetos com Unity.', 'Estudando Godot.', 'JÚNIOR', 
 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'JÚNIOR', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma'),

(7, 7, 'Mobile', 'Front-End', 'Desenvolvimento de aplicativos móveis', 
 1, 1, 2, 4, 4, 2, 2, 1, 2, 5, 5, 1, 1, 
 'Foco em desenvolvimento mobile.', 'Projetos com React Native.', 'Explorando Flutter.', 'PLENO', 
 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'PLENO', 'Nenhuma', 'Nenhuma'),

(8, 9, 'Dev RPA', 'Back-End', 'Automação de processos', 
 1, 2, 3, 2, 1, 5, 2, 1, 2, 1, 4, 5, 1, 
 'Experiência com RPA e automação.', 'Projetos de automação com Python.', 'Aprendendo Power Automate.', 'PLENO', 
 'PLENO', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'Nenhuma', 'JÚNIOR', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma'),

(9, 10, 'Análise de Dados', 'Banco de Dados', 'Foco em ciência de dados e modelagem preditiva', 
 1, 1, 2, 1, 2, 3, 5, 1, 2, 1, 2, 5, 1, 
 'Experiência com machine learning.', 'Projetos de análise preditiva.', 'Explorando Big Data.', 'PLENO', 
 'PLENO', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'Nenhuma', 'PLENO', 'PLENO', 'Nenhuma');

