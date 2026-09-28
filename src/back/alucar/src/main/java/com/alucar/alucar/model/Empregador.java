package com.alucar.alucar.model;

import com.alucar.alucar.dto.EmpregadorDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Empregador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Double rendimento;

    @ManyToOne
    private Cliente cliente;

    public void incorporarDTO(EmpregadorDTO empregador) {
        this.nome = empregador.nome();
        this.rendimento = empregador.rendimento();
        this.cliente = empregador.cliente();
    }

    public EmpregadorDTO criarDTO() {
        return new EmpregadorDTO(nome, rendimento, cliente);
    }
}