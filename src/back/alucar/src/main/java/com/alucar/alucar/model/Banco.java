package com.alucar.alucar.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Banco extends Agente {

    @OneToMany(mappedBy = "banco", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContratoCredito> contratosCredito = new ArrayList<>();

    public boolean aprovarContratoCredito(ContratoCredito contrato) {
        throw new UnsupportedOperationException("Aguardando implementação de ContratoCredito");
    }
}
