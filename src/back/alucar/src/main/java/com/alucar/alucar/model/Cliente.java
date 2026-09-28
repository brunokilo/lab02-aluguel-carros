package com.alucar.alucar.model;

import java.util.ArrayList;
import java.util.List;

import com.alucar.alucar.dto.ClienteDTO;
import com.alucar.alucar.dto.EmpregadorDTO;
import com.alucar.alucar.dto.UsuarioDTO;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Cliente extends Usuario {

    @Column(unique = true)
    private String rg;

    @Column(unique = true, nullable = false, length = 11)
    private String cpf;

    @Column(nullable = false)
    private String profissao;

    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private Endereco endereco;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Empregador> empregadores = new ArrayList<>();

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "cliente_automovel",
        joinColumns = @JoinColumn(name = "cliente_id"),
        inverseJoinColumns = @JoinColumn(name = "automovel_id")
    )
    private List<Automovel> automoveis = new ArrayList<>();

    public void incorporarDTO(ClienteDTO cliente) {
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

        List<EmpregadorDTO> empregadoresDTO =
            cliente.empregadores() != null ? cliente.empregadores() : List.of();

        this.empregadores.clear();
        empregadoresDTO.forEach(dto -> {
            Empregador emp = new Empregador();
            emp.setNome(dto.nome());
            emp.setRendimento(dto.rendimento());
            emp.setCliente(this);
            this.empregadores.add(emp);
        });
    }

    public ClienteDTO criarDTO() {
        var enderecoDTO = endereco != null ? endereco.criarDTO() : null;

        List<EmpregadorDTO> empregadoresDTO = empregadores.stream()
            .map(e -> new EmpregadorDTO(e.getNome(), e.getRendimento()))
            .toList();

        // A senha (nem o hash) nunca volta pro frontend
        UsuarioDTO usuarioDTO = new UsuarioDTO(getNome(), getEmail(), null);

        return new ClienteDTO(usuarioDTO, rg, cpf, profissao, enderecoDTO, empregadoresDTO);
    }
}
