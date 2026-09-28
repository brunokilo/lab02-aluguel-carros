package com.alucar.alucar.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AutomovelDTO(
    Long id,

    @NotBlank(message = "A placa é obrigatória")
    String placa,

    @NotNull(message = "O ano é obrigatório")
    @Min(value = 1950, message = "Ano inválido")
    @Max(value = 2100, message = "Ano inválido")
    Integer ano,

    @NotBlank(message = "A marca é obrigatória")
    String marca,

    @NotBlank(message = "O modelo é obrigatório")
    String modelo,

    boolean emUso
) {}
