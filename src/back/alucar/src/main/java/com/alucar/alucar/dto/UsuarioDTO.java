package com.alucar.alucar.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,
    @Email(message = "Email inválido")
    String email,
    String senha
) {}
