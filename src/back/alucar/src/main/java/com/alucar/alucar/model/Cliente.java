package com.alucar.alucar.model;

import java.util.LinkedList;
import java.util.List;

import com.alucar.alucar.dto.ClienteDTO;
import com.alucar.alucar.dto.EmpregadorDTO;

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

        if (cliente.endereco() != null) {
            Endereco endereco = this.endereco != null ? this.endereco : new Endereco();
            endereco.incorporarDTO(cliente.endereco());
            endereco.setCliente(this);
            this.endereco = endereco;
        }

        this.empregadores = cliente.empregadores().stream()
            .map(dto -> {
                Empregador emp = new Empregador();
                emp.setNome(dto.nome());
                emp.setRendimento(dto.rendimento());
                emp.setCliente(this);
                return emp;
            })
            .toList();
    }

    public ClienteDTO criarDTO() {
        var enderecoDTO = endereco != null ? endereco.criarDTO() : null;

        List<EmpregadorDTO> empregadoresDTO = empregadores.stream()
            .map(e -> new EmpregadorDTO(e.getNome(), e.getRendimento()))
            .toList();

        return new ClienteDTO(super.criarDTObase(), rg, cpf, profissao, enderecoDTO, empregadoresDTO);
    }
}
