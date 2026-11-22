package br.edu.ifpb.marketplace.anuncio;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import br.edu.ifpb.marketplace.catalogo.Nivel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NovoAnuncioForm(
        @NotBlank(message = "Obrigatório.") @Size(max = 100, message = "No máximo 100 caracteres.")
        @Schema(example = "Lógica de programação com Python") String titulo,

        @NotBlank(message = "Obrigatório.") @Size(max = 2000, message = "No máximo 2000 caracteres.")
        @Schema(example = "Aulas práticas, com exercícios a cada encontro.") String descricao,

        @NotNull(message = "Obrigatório.") Modalidade modalidade,

        @Digits(integer = 7, fraction = 2, message = "Use até 2 casas decimais.")
        @Schema(description = "Preço por aula, em reais. Obrigatório em vendas; vazio em doações", example = "30.00") BigDecimal preco,

        @NotNull(message = "Obrigatório.") Nivel nivel,

        @NotNull(message = "Obrigatório.") @Schema(example = "1") Long categoriaId,

        @NotBlank(message = "Obrigatório.") @Size(max = 200, message = "No máximo 200 caracteres.")
        @Schema(description = "Onde a aula acontece", example = "Laboratório de Informática 2, no contraturno") String localAula,

        @Schema(description = "De 1 a 10 imagens JPEG, PNG ou WebP, com até 5 MB cada")
        List<MultipartFile> fotos,

        @Schema(description = "Posição (a partir de 0) da foto de capa em `fotos`. Padrão: 0", example = "0")
        Integer capaIndice) implements DadosAnuncio {
}
