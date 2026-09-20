package com.alucar.alucar.model;

import java.util.LinkedList;
import java.util.List;

import com.alucar.alucar.dto.ClienteDTO;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity 
@NoArgsConstructor 
public class Cliente extends Usuario{

    @Column(unique=true)
    private String rg;
    
    @Column(unique=true, nullable = false, length = 11)
    private String cpf;
    
    @Column(nullable = false)
    private String profissao;

    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private Endereco endereco;
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Empregador> empregadores = new LinkedList<>();
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    
    private List<Pedido> pedidos = new LinkedList<>();

    public void incorporarDTO(ClienteDTO cliente){
        super.incorporarDTObase(cliente.usuario());
        this.rg = cliente.rg();
        this.cpf = cliente.cpf();
        this.profissao = cliente.profissao();
        this.endereco = cliente.endereco();
        this.empregadores = cliente.empregadores();
    }

    public ClienteDTO criarDTO(){
        return new ClienteDTO(super.criarDTObase(), rg, cpf, profissao, endereco, empregadores);
    }
}
