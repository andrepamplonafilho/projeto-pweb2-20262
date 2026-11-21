-- Carga de aulas: estudantes, aulas e fotos de exemplo, para ver o site com conteúdo.
-- Todos os estudantes usam a senha "senha123" (o mesmo hash do estudante de exemplo).
-- O administrador (admin@ifpb.edu.br, mesma senha) serve para a rota /admin da etapa 2.
--
-- Não usa ids fixos: cada linha procura o dono pelo e-mail, a categoria pelo slug e o curso pelo nome.
-- Assim a migração roda mesmo que o seu banco já tenha usuários ou anúncios cadastrados nos testes.
-- Se um e-mail, slug ou curso não existir, o NOT NULL da coluna recusa a linha e a migração falha com erro claro.
--
-- Preço em centavos (3000 = R$ 30,00 por aula de 1 hora). Aula gratuita (doacao) tem preço NULL.
-- As fotos ficam em backend/db/fotos (geradas por backend/db/gerar_imagens.py)
-- e são enviadas ao armazenamento com a chave carga/<arquivo>.

-- Estudantes e administrador
WITH v (nome, email, papel, curso, telefone, foto_chave, criado_em) AS (VALUES
  ('Mariana Alves Duarte', 'mariana.duarte@academico.ifpb.edu.br', 'estudante', 'Análise e Desenvolvimento de Sistemas', '(83) 99999-0002', 'carga/usuario-mariana-duarte.jpg', '2026-09-02T12:00:00Z'),
  ('Lucas Ferreira Nunes', 'lucas.nunes@academico.ifpb.edu.br', 'estudante', 'Técnico Integrado em Informática', '(83) 99999-0003', 'carga/usuario-lucas-nunes.jpg', '2026-09-02T14:30:00Z'),
  ('Beatriz Souza Lacerda', 'beatriz.lacerda@academico.ifpb.edu.br', 'estudante', 'Licenciatura em Matemática', '(83) 99999-0004', 'carga/usuario-beatriz-lacerda.jpg', '2026-09-03T09:15:00Z'),
  ('Rafael Lima Cavalcanti', 'rafael.cavalcanti@academico.ifpb.edu.br', 'estudante', 'Engenharia de Controle e Automação', '(83) 99999-0005', 'carga/usuario-rafael-cavalcanti.jpg', '2026-09-03T16:40:00Z'),
  ('Camila Rocha Medeiros', 'camila.medeiros@academico.ifpb.edu.br', 'estudante', 'Engenharia Civil', '(83) 99999-0006', 'carga/usuario-camila-medeiros.jpg', '2026-09-04T11:00:00Z'),
  ('Pedro Henrique Gomes', 'pedro.gomes@academico.ifpb.edu.br', 'estudante', 'Técnico Subsequente em Eletromecânica', '(83) 99999-0007', 'carga/usuario-pedro-gomes.jpg', '2026-09-04T18:20:00Z'),
  ('Ana Clara Pereira', 'ana.pereira@academico.ifpb.edu.br', 'estudante', 'Técnico em Meio Ambiente', '(83) 99999-0008', 'carga/usuario-ana-pereira.jpg', '2026-09-05T08:45:00Z'),
  ('Thiago Barbosa Leite', 'thiago.leite@academico.ifpb.edu.br', 'estudante', 'Técnico Integrado em Edificações', NULL, NULL, '2026-09-05T10:10:00Z'),
  ('Administrador do Campus', 'admin@ifpb.edu.br', 'administrador', NULL, NULL, NULL, '2026-09-01T08:00:00Z'))
INSERT INTO usuario (nome, email, senha_hash, papel, curso_id, telefone, foto_chave, criado_em)
SELECT v.nome, v.email, '$2y$10$gSKL.siB69Xlo8mvaO17QOXct0eEke9fMD7DTL5pmmOoGCBNtS8BW', v.papel, c.id, v.telefone, v.foto_chave, v.criado_em
  FROM v LEFT JOIN curso c ON c.nome = v.curso;

-- Aulas. Estados: ativo, pausado, reservado, vendido (só aula paga) e concluido (só aula gratuita).
-- Só as ativas aparecem na busca; as demais aparecem no perfil do dono.
WITH v (email, categoria, titulo, descricao, modalidade, preco_centavos, nivel, local_aula, estado, publicado_em, atualizado_em) AS (VALUES
  ('mariana.duarte@academico.ifpb.edu.br', 'computacao-e-programacao', 'Lógica de programação com Python do zero', 'Para quem nunca programou. Vemos variáveis, condicionais, laços e funções, com exercícios em todos os encontros. Valor por aula de 1 hora.', 'venda', 3000, 'iniciante', 'Laboratório de Informática 2 ou Google Meet', 'ativo', '2026-09-05T13:10:00Z', '2026-09-05T13:10:00Z'),
  ('mariana.duarte@academico.ifpb.edu.br', 'computacao-e-programacao', 'Banco de dados e SQL na prática', 'Modelagem relacional, consultas com JOIN e agregações, usando SQLite e PostgreSQL. Ideal para quem está cursando Banco de Dados. Valor por aula de 1 hora.', 'venda', 3500, 'intermediario', 'Biblioteca do campus ou Google Meet', 'ativo', '2026-09-12T15:00:00Z', '2026-09-12T15:00:00Z'),
  ('lucas.nunes@academico.ifpb.edu.br', 'computacao-e-programacao', 'HTML e CSS: monte sua primeira página', 'Para quem está começando na web. Estrutura de uma página, formulários, flexbox e responsividade, com um mini projeto no final. Aula gratuita.', 'doacao', NULL, 'iniciante', 'Laboratório de Informática 1, no contraturno', 'ativo', '2026-09-14T09:30:00Z', '2026-09-14T09:30:00Z'),
  ('lucas.nunes@academico.ifpb.edu.br', 'computacao-e-programacao', 'JavaScript para quem já sabe HTML e CSS', 'DOM, eventos, fetch e consumo de APIs. Boa preparação para começar React. Valor por aula de 1 hora.', 'venda', 2500, 'intermediario', 'Google Meet', 'ativo', '2026-09-20T18:00:00Z', '2026-09-20T18:00:00Z'),
  ('mariana.duarte@academico.ifpb.edu.br', 'computacao-e-programacao', 'Git e GitHub para trabalhos em equipe', 'Branches, pull requests e resolução de conflitos, no fluxo usado nos projetos das disciplinas. Aula gratuita.', 'doacao', NULL, 'intermediario', 'Laboratório de Informática 2', 'concluido', '2026-09-22T10:00:00Z', '2026-10-06T10:00:00Z'),
  ('estudante@academico.ifpb.edu.br', 'computacao-e-programacao', 'Estruturas de dados em Java', 'Listas, pilhas, filas, árvores e tabelas hash, com implementação própria e análise de complexidade. Valor por aula de 1 hora.', 'venda', 4500, 'avancado', 'Laboratório de Informática 3', 'ativo', '2026-09-25T17:30:00Z', '2026-09-25T17:30:00Z'),
  ('estudante@academico.ifpb.edu.br', 'computacao-e-programacao', 'Monitoria de Algoritmos', 'Resolução passo a passo das listas de exercícios de Algoritmos e Programação, em grupos de até 5 pessoas. Aula gratuita.', 'doacao', NULL, 'iniciante', 'Biblioteca do campus', 'ativo', '2026-10-01T19:00:00Z', '2026-10-01T19:00:00Z'),
  ('rafael.cavalcanti@academico.ifpb.edu.br', 'automacao-e-eletromecanica', 'Arduino na prática: LEDs, sensores e motores', 'Montagem de circuitos e programação do Arduino Uno com sensores de temperatura, ultrassom e LDR. Os materiais são fornecidos nas aulas. Valor por aula de 1 hora.', 'venda', 3500, 'iniciante', 'Laboratório de Automação', 'ativo', '2026-09-18T14:00:00Z', '2026-09-18T14:00:00Z'),
  ('rafael.cavalcanti@academico.ifpb.edu.br', 'automacao-e-eletromecanica', 'Controle PID: teoria e simulação', 'Modelagem de sistemas, ajuste de ganhos e simulação em Python e Scilab. Para quem está cursando Controle I ou II. Valor por aula de 1 hora.', 'venda', 5500, 'avancado', 'Google Meet', 'reservado', '2026-10-02T13:00:00Z', '2026-10-09T13:00:00Z'),
  ('pedro.gomes@academico.ifpb.edu.br', 'automacao-e-eletromecanica', 'Comandos elétricos: partida direta e reversão', 'Leitura de diagramas e montagem com contatores, relés e botoeiras, com prática no painel. Valor por aula de 1 hora.', 'venda', 3000, 'intermediario', 'Laboratório de Eletromecânica', 'ativo', '2026-09-28T08:15:00Z', '2026-09-28T08:15:00Z'),
  ('pedro.gomes@academico.ifpb.edu.br', 'automacao-e-eletromecanica', 'Como usar o multímetro sem erro', 'Medição de tensão, corrente, resistência e continuidade com segurança. Aula curta, de cerca de 30 minutos. Aula gratuita.', 'doacao', NULL, 'iniciante', 'Bloco de Eletromecânica, intervalo da tarde', 'ativo', '2026-10-07T11:00:00Z', '2026-10-07T11:00:00Z'),
  ('rafael.cavalcanti@academico.ifpb.edu.br', 'automacao-e-eletromecanica', 'CLP: introdução à programação em Ladder', 'Entradas e saídas, temporizadores, contadores e intertravamentos, com simulação. Valor por aula de 1 hora.', 'venda', 4000, 'intermediario', 'Laboratório de Automação', 'pausado', '2026-10-09T12:30:00Z', '2026-10-10T12:30:00Z'),
  ('camila.medeiros@academico.ifpb.edu.br', 'construcao-civil-e-edificacoes', 'Desenho técnico e leitura de plantas', 'Escalas, cotas, cortes e fachadas, com treino de leitura de projetos arquitetônicos. Valor por aula de 1 hora.', 'venda', 3000, 'iniciante', 'Sala de Desenho, Bloco de Edificações', 'ativo', '2026-09-10T10:30:00Z', '2026-09-10T10:30:00Z'),
  ('camila.medeiros@academico.ifpb.edu.br', 'construcao-civil-e-edificacoes', 'AutoCAD 2D: do básico às plantas baixas', 'Comandos essenciais, camadas, blocos e impressão em escala, até concluir uma planta baixa completa. Valor por aula de 1 hora.', 'venda', 4000, 'intermediario', 'Laboratório de Informática 1', 'ativo', '2026-10-04T15:40:00Z', '2026-10-04T15:40:00Z'),
  ('thiago.leite@academico.ifpb.edu.br', 'construcao-civil-e-edificacoes', 'Resistência dos materiais: exercícios resolvidos', 'Tração, compressão, cisalhamento e flexão, com resolução comentada das listas. Aula gratuita.', 'doacao', NULL, 'intermediario', 'Biblioteca do campus', 'ativo', '2026-10-11T09:45:00Z', '2026-10-11T09:45:00Z'),
  ('thiago.leite@academico.ifpb.edu.br', 'construcao-civil-e-edificacoes', 'Topografia: nível e estação total em campo', 'Nivelamento geométrico, levantamento planimétrico e cálculo de cadernetas, com prática em campo. Valor por aula de 1 hora.', 'venda', 3500, 'avancado', 'Pátio do campus (aula de campo)', 'vendido', '2026-09-14T09:00:00Z', '2026-09-25T09:00:00Z'),
  ('beatriz.lacerda@academico.ifpb.edu.br', 'matematica', 'Pré-cálculo: funções e gráficos', 'Revisão de funções afim, quadrática, exponencial e logarítmica, com ênfase na construção e leitura de gráficos. Valor por aula de 1 hora.', 'venda', 2500, 'iniciante', 'Bloco de Matemática', 'ativo', '2026-09-08T15:00:00Z', '2026-09-08T15:00:00Z'),
  ('beatriz.lacerda@academico.ifpb.edu.br', 'matematica', 'Cálculo I: limites e derivadas', 'Limites, continuidade, regras de derivação e aplicações, com listas de exercícios comentadas. Valor por aula de 1 hora.', 'venda', 3500, 'intermediario', 'Biblioteca do campus ou Google Meet', 'ativo', '2026-09-15T16:20:00Z', '2026-09-15T16:20:00Z'),
  ('beatriz.lacerda@academico.ifpb.edu.br', 'matematica', 'Matemática básica para o ENEM', 'Porcentagem, razão e proporção, geometria e interpretação de gráficos, com questões de provas anteriores. Aula gratuita.', 'doacao', NULL, 'iniciante', 'Sala 12, Bloco de Matemática', 'ativo', '2026-10-14T14:10:00Z', '2026-10-14T14:10:00Z'),
  ('beatriz.lacerda@academico.ifpb.edu.br', 'matematica', 'Álgebra linear: matrizes e sistemas', 'Operações com matrizes, determinantes, escalonamento e espaços vetoriais. Valor por aula de 1 hora.', 'venda', 4000, 'avancado', 'Google Meet', 'ativo', '2026-10-16T16:00:00Z', '2026-10-16T16:00:00Z'),
  ('ana.pereira@academico.ifpb.edu.br', 'meio-ambiente', 'Gestão de resíduos sólidos: conceitos e casos', 'Política Nacional de Resíduos Sólidos, coleta seletiva e compostagem, com estudos de caso do município. Aula gratuita.', 'doacao', NULL, 'intermediario', 'Laboratório de Meio Ambiente', 'ativo', '2026-10-20T10:00:00Z', '2026-10-20T10:00:00Z'),
  ('ana.pereira@academico.ifpb.edu.br', 'meio-ambiente', 'Qualidade da água: análises em laboratório', 'pH, turbidez, oxigênio dissolvido e interpretação dos resultados segundo a legislação. Valor por aula de 1 hora.', 'venda', 3000, 'intermediario', 'Laboratório de Meio Ambiente', 'ativo', '2026-10-22T13:30:00Z', '2026-10-22T13:30:00Z'),
  ('lucas.nunes@academico.ifpb.edu.br', 'outras-areas', 'Inglês técnico para ler documentação', 'Vocabulário e estratégias de leitura para documentação, artigos e mensagens de erro em inglês. Aula gratuita.', 'doacao', NULL, 'intermediario', 'Google Meet', 'pausado', '2026-10-25T09:00:00Z', '2026-10-27T09:00:00Z'),
  ('mariana.duarte@academico.ifpb.edu.br', 'outras-areas', 'Excel para planilhas acadêmicas', 'Fórmulas, tabelas dinâmicas e gráficos para relatórios de laboratório e trabalhos. Valor por aula de 1 hora.', 'venda', 2000, 'iniciante', 'Laboratório de Informática 2', 'ativo', '2026-10-28T14:00:00Z', '2026-10-28T14:00:00Z'),
  ('camila.medeiros@academico.ifpb.edu.br', 'outras-areas', 'Relatórios técnicos e normas ABNT', 'Estrutura do relatório, citações, referências e formatação segundo a ABNT. Aula gratuita.', 'doacao', NULL, 'iniciante', 'Biblioteca do campus', 'ativo', '2026-11-03T10:30:00Z', '2026-11-03T10:30:00Z'))
INSERT INTO anuncio (usuario_id, categoria_id, titulo, descricao, modalidade, preco_centavos, nivel, local_aula, estado, publicado_em, atualizado_em)
SELECT u.id, c.id, v.titulo, v.descricao, v.modalidade, v.preco_centavos, v.nivel, v.local_aula, v.estado, v.publicado_em, v.atualizado_em
  FROM v
  LEFT JOIN usuario u ON u.email = v.email
  LEFT JOIN categoria c ON c.slug = v.categoria
 ORDER BY v.publicado_em;

-- Fotos das aulas (de 1 a 3 por aula). A primeira de cada aula é a capa (capa = 1).
WITH v (titulo, chave, ordem, capa) AS (VALUES
  ('Lógica de programação com Python do zero', 'carga/aula-01-1.jpg', 0, 1),
  ('Lógica de programação com Python do zero', 'carga/aula-01-2.jpg', 1, 0),
  ('Banco de dados e SQL na prática', 'carga/aula-02-1.jpg', 0, 1),
  ('HTML e CSS: monte sua primeira página', 'carga/aula-03-1.jpg', 0, 1),
  ('HTML e CSS: monte sua primeira página', 'carga/aula-03-2.jpg', 1, 0),
  ('JavaScript para quem já sabe HTML e CSS', 'carga/aula-04-1.jpg', 0, 1),
  ('Git e GitHub para trabalhos em equipe', 'carga/aula-05-1.jpg', 0, 1),
  ('Estruturas de dados em Java', 'carga/aula-06-1.jpg', 0, 1),
  ('Estruturas de dados em Java', 'carga/aula-06-2.jpg', 1, 0),
  ('Estruturas de dados em Java', 'carga/aula-06-3.jpg', 2, 0),
  ('Monitoria de Algoritmos', 'carga/aula-07-1.jpg', 0, 1),
  ('Arduino na prática: LEDs, sensores e motores', 'carga/aula-08-1.jpg', 0, 1),
  ('Arduino na prática: LEDs, sensores e motores', 'carga/aula-08-2.jpg', 1, 0),
  ('Arduino na prática: LEDs, sensores e motores', 'carga/aula-08-3.jpg', 2, 0),
  ('Controle PID: teoria e simulação', 'carga/aula-09-1.jpg', 0, 1),
  ('Comandos elétricos: partida direta e reversão', 'carga/aula-10-1.jpg', 0, 1),
  ('Comandos elétricos: partida direta e reversão', 'carga/aula-10-2.jpg', 1, 0),
  ('Como usar o multímetro sem erro', 'carga/aula-11-1.jpg', 0, 1),
  ('CLP: introdução à programação em Ladder', 'carga/aula-12-1.jpg', 0, 1),
  ('Desenho técnico e leitura de plantas', 'carga/aula-13-1.jpg', 0, 1),
  ('Desenho técnico e leitura de plantas', 'carga/aula-13-2.jpg', 1, 0),
  ('AutoCAD 2D: do básico às plantas baixas', 'carga/aula-14-1.jpg', 0, 1),
  ('AutoCAD 2D: do básico às plantas baixas', 'carga/aula-14-2.jpg', 1, 0),
  ('AutoCAD 2D: do básico às plantas baixas', 'carga/aula-14-3.jpg', 2, 0),
  ('Resistência dos materiais: exercícios resolvidos', 'carga/aula-15-1.jpg', 0, 1),
  ('Topografia: nível e estação total em campo', 'carga/aula-16-1.jpg', 0, 1),
  ('Pré-cálculo: funções e gráficos', 'carga/aula-17-1.jpg', 0, 1),
  ('Pré-cálculo: funções e gráficos', 'carga/aula-17-2.jpg', 1, 0),
  ('Cálculo I: limites e derivadas', 'carga/aula-18-1.jpg', 0, 1),
  ('Matemática básica para o ENEM', 'carga/aula-19-1.jpg', 0, 1),
  ('Matemática básica para o ENEM', 'carga/aula-19-2.jpg', 1, 0),
  ('Álgebra linear: matrizes e sistemas', 'carga/aula-20-1.jpg', 0, 1),
  ('Gestão de resíduos sólidos: conceitos e casos', 'carga/aula-21-1.jpg', 0, 1),
  ('Gestão de resíduos sólidos: conceitos e casos', 'carga/aula-21-2.jpg', 1, 0),
  ('Qualidade da água: análises em laboratório', 'carga/aula-22-1.jpg', 0, 1),
  ('Inglês técnico para ler documentação', 'carga/aula-23-1.jpg', 0, 1),
  ('Excel para planilhas acadêmicas', 'carga/aula-24-1.jpg', 0, 1),
  ('Relatórios técnicos e normas ABNT', 'carga/aula-25-1.jpg', 0, 1))
INSERT INTO anuncio_foto (anuncio_id, chave, ordem, capa)
SELECT a.id, v.chave, v.ordem, v.capa
  FROM v LEFT JOIN anuncio a ON a.titulo = v.titulo;