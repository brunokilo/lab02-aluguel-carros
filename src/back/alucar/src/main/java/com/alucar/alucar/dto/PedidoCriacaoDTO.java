package com.alucar.alucar.dto;

import com.alucar.alucar.enums.ModalidadeContrato;

import jakarta.validation.constraints.NotNull;

public record PedidoCriacaoDTO(
    @NotNull(message = "É necessário escolher um automóvel")
    Long automovelId,

    @NotNull(message = "É necessário escolher a modalidade do contrato")
    ModalidadeContrato modalidade
) {}
