package com.alucar.alucar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EmpregadorDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,

    @NotNull(message = "O rendimento é obrigatório")
    Double rendimento
) {}
