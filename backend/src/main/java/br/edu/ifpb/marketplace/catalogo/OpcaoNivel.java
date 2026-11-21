package br.edu.ifpb.marketplace.catalogo;

import io.swagger.v3.oas.annotations.media.Schema;

public record OpcaoNivel(
        @Schema(description = "Valor enviado à API", example = "intermediario") Nivel valor,
        @Schema(description = "Texto para exibir", example = "Intermediário") String rotulo) {
}
