package com.alucar.alucar.dto;

import java.time.LocalDate;

import com.alucar.alucar.enums.Parecer;
import com.alucar.alucar.enums.StatusPedido;

public record PedidoDTO(
    Long id,
    LocalDate dataCriacao,
    StatusPedido status,
    Parecer parecer,
    AutomovelDTO automovelDesejado,
    Long clienteId,
    String clienteNome
) {}
