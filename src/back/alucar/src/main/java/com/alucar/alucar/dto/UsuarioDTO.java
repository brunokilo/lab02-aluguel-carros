package com.alucar.alucar.dto;

import jakarta.validation.constraints.NotBlank;

public record UsuarioDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,
    String email,
    String senha
) {}
