package com.alucar.alucar.dto;

import jakarta.validation.constraints.NotNull;

public record PedidoCriacaoDTO(
    @NotNull(message = "É necessário escolher um automóvel")
    Long automovelId
) {}
