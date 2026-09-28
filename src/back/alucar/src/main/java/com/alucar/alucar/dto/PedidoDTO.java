package com.alucar.alucar.dto;

import java.time.LocalDate;
import java.util.List;

import com.alucar.alucar.enums.ModalidadeContrato;
import com.alucar.alucar.enums.Parecer;
import com.alucar.alucar.enums.StatusPedido;

public record PedidoDTO(
    Long id,
    LocalDate dataCriacao,
    StatusPedido status,
    Parecer parecer,
    ModalidadeContrato modalidade,
    AutomovelDTO automovelDesejado,
    Long clienteId,
    String clienteNome,
    // Renda declarada pelo cliente — o agente/banco usa isso pra fundamentar o parecer
    List<EmpregadorDTO> empregadoresCliente,
    // Só preenchido quando modalidade = LEASING e o banco já deu parecer positivo
    String numeroContratoCredito
) {}
