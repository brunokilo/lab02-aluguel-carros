package com.alucar.alucar.dto;

import java.util.List;

import org.hibernate.validator.constraints.br.CPF;

import com.alucar.alucar.model.Empregador;
import com.alucar.alucar.model.Endereco;

import jakarta.validation.constraints.NotBlank;

public record ClienteDTO(
    UsuarioDTO usuario,

    String rg,

    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF inválido")
    String cpf,

    @NotBlank(message = "A profissão é obrigatória")
    String profissao,

    Endereco endereco,

    List<Empregador> empregadores
) {}