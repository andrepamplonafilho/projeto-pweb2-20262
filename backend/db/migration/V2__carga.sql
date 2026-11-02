-- Dados iniciais do Marketplace IFPB Cajazeiras. Migração do Flyway, aplicada pela API ao subir.
-- Guia completo: docs/banco-de-dados.md

-- Cursos do campus
INSERT INTO curso (nome) VALUES
  ('Análise e Desenvolvimento de Sistemas'),
  ('Engenharia de Controle e Automação'),
  ('Engenharia Civil'),
  ('Licenciatura em Matemática'),
  ('Técnico Integrado em Edificações'),
  ('Técnico Integrado em Eletromecânica'),
  ('Técnico Integrado em Informática'),
  ('Técnico Subsequente em Edificações'),
  ('Técnico Subsequente em Eletromecânica'),
  ('Técnico em Meio Ambiente');

-- Categorias do marketplace de aulas, organizadas por área dos cursos do campus.
-- O slug vai na URL da busca (?categoria=computacao-e-programacao): minúsculas, sem acentos, hífen no lugar de espaços.
INSERT INTO categoria (id, nome, slug) VALUES
  (1, 'Computação e Programação', 'computacao-e-programacao'),
  (2, 'Automação e Eletromecânica', 'automacao-e-eletromecanica'),
  (3, 'Construção Civil e Edificações', 'construcao-civil-e-edificacoes'),
  (4, 'Matemática', 'matematica'),
  (5, 'Meio Ambiente', 'meio-ambiente'),
  (6, 'Outras áreas', 'outras-areas');

-- ---------------------------------------------------------------------------
-- Dados de exemplo. Os anúncios de itens foram removidos porque não combinam com aulas.
-- Fica só o estudante de exemplo, com a senha "senha123", para testar o login.
-- ---------------------------------------------------------------------------

INSERT INTO usuario (id, nome, email, senha_hash, papel, curso_id, telefone, foto_chave, criado_em) VALUES
  (1, 'Estudante de Exemplo', 'estudante@academico.ifpb.edu.br', '$2y$10$gSKL.siB69Xlo8mvaO17QOXct0eEke9fMD7DTL5pmmOoGCBNtS8BW', 'estudante', 1, '(83) 99999-0001', 'carga/usuario-estudante.jpg', '2026-09-01T12:00:00Z');
