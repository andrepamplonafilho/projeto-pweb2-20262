package br.edu.ifpb.marketplace.anuncio;

import java.math.BigDecimal;

import br.edu.ifpb.marketplace.catalogo.Nivel;

/** Campos comuns à criação e à edição de anúncio. */
public interface DadosAnuncio {

    String titulo();

    String descricao();

    Modalidade modalidade();

    BigDecimal preco();

    Nivel nivel();

    Long categoriaId();

    String localAula();
}
