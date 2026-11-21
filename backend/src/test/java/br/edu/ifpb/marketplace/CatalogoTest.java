package br.edu.ifpb.marketplace;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class CatalogoTest extends IntegracaoBase {

    @Test
    void listaOsDezCursosSemToken() {
        Resposta r = api.get("/cursos", null);

        assertThat(r.status()).isEqualTo(200);
        assertThat(r.<List<?>>json("$")).hasSize(10);
    }

    @Test
    void listaAsCategoriasComSlug() {
        Resposta r = api.get("/categorias", null);

        assertThat(r.status()).isEqualTo(200);
        assertThat(r.<List<String>>json("$[*].slug")).containsExactly("eletronicos");
        assertThat(r.<String>json("$[0].nome")).isEqualTo("Eletrônicos");
    }

    @Test
    void listaOsNiveisDasAulas() {
        Resposta r = api.get("/niveis", null);

        assertThat(r.<List<String>>json("$[*].valor")).containsExactly("iniciante", "intermediario", "avancado");
        assertThat(r.<List<String>>json("$[*].rotulo")).containsExactly("Iniciante", "Intermediário", "Avançado");
    }
}
