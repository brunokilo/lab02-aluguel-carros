package com.alucar.alucar.dto;

import com.alucar.alucar.model.Cliente;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EmpregadorDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,

    @NotNull(message = "O rendimento é obrigatório")
    Double rendimento,

    Cliente cliente
) {}
