package com.alucar.alucar.model;

import java.time.LocalDate;

import com.alucar.alucar.enums.ModalidadeContrato;
import com.alucar.alucar.enums.Parecer;
import com.alucar.alucar.enums.StatusPedido;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataCriacao;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    @Enumerated(EnumType.STRING)
    private Parecer parecer;

    // Escolhida pelo cliente já na criação do pedido: define quem avalia
    // (leasing exige um banco) e se um contrato de crédito é gerado.
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ModalidadeContrato modalidade;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "automovel_desejado_id", nullable = false)
    private Automovel automovelDesejado;

    @ManyToOne
    @JoinColumn(name = "agente_id")
    private Agente agente;

    // Só existe quando modalidade = LEASING e o parecer do banco é positivo
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "contrato_credito_id")
    private ContratoCredito contratoCredito;
}