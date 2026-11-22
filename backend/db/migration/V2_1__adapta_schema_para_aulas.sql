-- Adapta o schema de produtos para aulas.
--   anuncio.estado_conservacao (novo, seminovo, usado)  ->  anuncio.nivel (iniciante, intermediario, avancado)
--   anuncio.local_entrega                                 ->  anuncio.local_aula
-- O SQLite não altera CHECK de uma coluna existente, então as tabelas são recriadas com os dados copiados.
-- A API roda com foreign_keys=ON: as fotos são guardadas antes do DROP de anuncio,
-- senão o ON DELETE CASCADE as apagaria junto.

CREATE TABLE anuncio_foto_antiga AS SELECT * FROM anuncio_foto;
CREATE TABLE anuncio_antigo AS SELECT * FROM anuncio;

DROP TABLE anuncio_foto;
DROP TABLE anuncio;

CREATE TABLE anuncio (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id         INTEGER NOT NULL REFERENCES usuario (id),
  categoria_id       INTEGER NOT NULL REFERENCES categoria (id),
  titulo             TEXT NOT NULL,
  descricao          TEXT NOT NULL,
  modalidade         TEXT NOT NULL CHECK (modalidade IN ('venda', 'doacao')),  -- venda = aula paga, doacao = aula gratuita
  preco_centavos     INTEGER,                -- preço por aula, em centavos. NULL em aula gratuita
  nivel              TEXT NOT NULL CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  local_aula         TEXT NOT NULL,          -- onde a aula acontece (sala, laboratório, online...)
  estado             TEXT NOT NULL DEFAULT 'ativo'
                     CHECK (estado IN ('ativo', 'pausado', 'reservado', 'vendido', 'concluido')),
  publicado_em       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  atualizado_em      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  CHECK ((modalidade = 'venda'  AND preco_centavos > 0 AND estado <> 'concluido') OR
         (modalidade = 'doacao' AND preco_centavos IS NULL AND estado <> 'vendido'))
);

CREATE INDEX idx_anuncio_busca ON anuncio (modalidade, estado, publicado_em);
CREATE INDEX idx_anuncio_usuario ON anuncio (usuario_id);

-- Anúncios que já existiam eram de produtos: não há nível equivalente, então ficam como iniciante.
INSERT INTO anuncio (id, usuario_id, categoria_id, titulo, descricao, modalidade, preco_centavos,
                     nivel, local_aula, estado, publicado_em, atualizado_em)
SELECT id, usuario_id, categoria_id, titulo, descricao, modalidade, preco_centavos,
       'iniciante', local_entrega, estado, publicado_em, atualizado_em
  FROM anuncio_antigo;

CREATE TABLE anuncio_foto (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  anuncio_id INTEGER NOT NULL REFERENCES anuncio (id) ON DELETE CASCADE,
  chave      TEXT NOT NULL,
  ordem      INTEGER NOT NULL,
  capa       INTEGER NOT NULL DEFAULT 0 CHECK (capa IN (0, 1))
);

CREATE INDEX idx_foto_anuncio ON anuncio_foto (anuncio_id, ordem);
-- No máximo uma capa por anúncio
CREATE UNIQUE INDEX idx_foto_capa ON anuncio_foto (anuncio_id) WHERE capa = 1;

INSERT INTO anuncio_foto (id, anuncio_id, chave, ordem, capa)
SELECT id, anuncio_id, chave, ordem, capa FROM anuncio_foto_antiga;

DROP TABLE anuncio_foto_antiga;
DROP TABLE anuncio_antigo;