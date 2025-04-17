SELECT * FROM dadosensivel;
SELECT * FROM dadosensivelrepresentante;
SELECT * FROM empresa;
SELECT * FROM equipes;
SELECT * FROM imersao;
SELECT * FROM logs_fabrica;
SELECT * FROM palestras;
SELECT * FROM participante;
SELECT * FROM perfilparticipante;
SELECT * FROM projetos;
SELECT * FROM usuario;
SELECT * FROM workshop;

INSERT INTO usuario VALUES(1, 'Administrador', 'Wallace Bonfim'),
						  (2, 'Tech Leader', 'Daniel Brandão'),
						  (3, 'Extensionista', 'Lucca de Sena Barbosa'),
						  (4, 'Extensionista', 'Paulo Albuquerque'),
						  (5, 'Imersionista', 'João Pedro Marques'),
						  (6, 'Extensionista', 'Gustavo Souza'),
						  (7, 'Extensionista', 'Fernando Henrique'),
						  (8, 'Imersionista', 'Emanuel Dias'),
						  (9, 'Extensionista', 'Renato Araújo Lima'),
						  (10, 'Instrutor de Workshop', 'Gabriel Vieira do Santos'),
						  (11, 'Tech Leader', 'Ricardo Veloso'),
						  (12, 'Extensionista', 'Victor Almeida');
                          
INSERT INTO dadosensivel(ID_Dado_Sensivel, ID_Usuario, Email_Institucional, Email_Cadastro, Telefone, codigo, CPF, Senha_Cadastro) VALUES
						(1, 1,'wallace.bonfim@unipe.edu.br', 'wallace123@otmail.com', '+55 (83) 99423-2345', '11111111', '58741296300', 'aBcDeFgHiJkLmNoPqRsTuVwXyZ123!'),
						(2, 2,'daniel.brandao@unipe.edu.br', 'daniel.fullstack@gmail.com', '+55 (83) 99656-8945', '22222222', '98765432109', 'PqRsTuVwXyZaBcDeFgHiJkLmNo123$'),
						(3, 3,'lucca.barbosa@cs.unipe.edu.br', 'senaluc@gmail.com', '+55 (83) 99907-4522', '33333333', '10293847561', 'xYzAbCdEfGhIjKlMnOpQrStUvW123%'),
						(4, 4,'paulo.albuquerque@cs.unipe.edu.br', 'paulin.insano33@gmail.com', '+55 (83) 99494-4344', '44444444', '65478912302', 'StUvWxYzAbCdEfGhIjKlMnOpQr123^'),
						(5, 5,'joao.marques@cs.unipe.edu.br', 'soledbyjoaozin11@gmail.com', '+55 (83) 99100-2003', '55555555', '32165498703', 'mNoPqRsTuVwXyZaBcDeFgHiJkL123&'),
						(6, 6,'gustavo.souza@cs.unipe.edu.br', 'gustabo.onepiece@hotmail.com', '+55 (83) 99492-6023', '66666666', '74185296304', 'gHiJkLmNoPqRsTuVwXyZaBcDeF123*'),
						(7, 7,'fernando.henrique@cs.unipe.edu.br', 'ferhen786@gmail.com', '+55 (83) 99893-8889', '77777777', '25836914705', 'cDeFgHiJkLmNoPqRsTuVwXyZaB123('),
						(8, 8,'emanuel.dias@cs.unipe.edu.br', 'manenoites82@gmail.com', '+55 (83) 99453-4964', '88888888', '85296374106', 'yZaBcDeFgHiJkLmNoPqRsTuVwX123)'),
						(9, 9,'renato.lima@cs.unipe.edu.br', 'natolimao237@hotmail.com', '+55 (83) 99842-7352', '99999999', '41728395607', 'uVwXyZaBcDeFgHiJkLmNoPqRsT123!@'),
						(10, 10,'gabriel.santos@cs.unipe.edu.br', 'santogabe777@hotmail.com', '+55 (83) 99942', '00000000', '96385274108', 'oPqRsTuVwXyZaBcDeFgHiJkLmN123#$'),
						(11, 11,'ricardo.veloso@unipe.edu.br', 'ricardo.datascientist', '+55 (83) 99675-9840', '01010101', '03692581479', 'jKlMnOpQrStUvWxYzAbCdEfGhI123%^'),
						(12, 12,'victor.almeida@cs.unipe.edu.br', 'victoralpvp@hotmail.com', '+55 (83) 999534-9909', '12121212', '78945612301', 'dEfGhIjKlMnOpQrStUvWxYzA123&*');
                        
INSERT INTO empresa VALUES(1, 'Fábrica de Software', 'Wallace Bonfim', 'fabrica.contato2025@gmail.com', '00623904000173'),
						  (2, 'Amazon', 'Jeff Bezos', 'amazon.contanto@gmail.com', '15436940000103');

					
INSERT INTO projetos VALUES(1,'Desenvolvimento da funcionalidade principal', '2025-06-30', 'Ativo', 'Levantamento de Requisitos', 'Necessário alocar um designer.', 'Unipê. O sistema visa atender às
necessidades de alunos, instrutores, administradores e empresas parceiras, proporcionando controle, acompanhamento e automação de processos relacionados à extensão universitária.', 'F360',  '2025-05-30', 1);

DELETE FROM projetos WHERE ID_Projeto=1;

INSERT INTO equipes VALUES (3, 1, 'Analista de Dados', 1),
							(11, 1, 'Tech Leader', 2),
                            (4, 1, 'Front-End', 3),
                            (6, 1, 'Back-End', 4);