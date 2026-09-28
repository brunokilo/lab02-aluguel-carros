package com.alucar.alucar.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Agente extends Usuario {

    @OneToMany(mappedBy = "agente")
    private List<Pedido> pedidosAvaliados = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "agente_automovel",
        joinColumns = @JoinColumn(name = "agente_id"),
        inverseJoinColumns = @JoinColumn(name = "automovel_id")
    )
    private List<Automovel> automoveis = new ArrayList<>();
}