package br.edu.ifpb.marketplace.catalogo;

/** Nível da aula. As constantes têm o mesmo nome usado no JSON, na query string e no banco. */
public enum Nivel {
    iniciante("Iniciante"),
    intermediario("Intermediário"),
    avancado("Avançado");

    private final String rotulo;

    Nivel(String rotulo) {
        this.rotulo = rotulo;
    }

    public String rotulo() {
        return rotulo;
    }
}
