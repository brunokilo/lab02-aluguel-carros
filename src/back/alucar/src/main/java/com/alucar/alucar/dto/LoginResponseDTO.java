package com.alucar.alucar.dto;

public record LoginResponseDTO(
    Long id,
    String nome,
    String email,
    String tipo
) {}
