package br.edu.ifpb.marketplace.anuncio;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record AlterarEstadoRequest(
        @NotNull(message = "Obrigatório.")
        @Schema(description = "`vendido` só em aulas pagas; `concluido` só em aulas gratuitas", example = "reservado")
        EstadoAnuncio estado) {
}
