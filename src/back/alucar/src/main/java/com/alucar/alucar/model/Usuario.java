package com.alucar.alucar.model;

import com.alucar.alucar.dto.UsuarioDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity 
@NoArgsConstructor 
public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    protected String nome;
    
    @Column(nullable = false)
    protected String email;
    
    @Column(nullable = false)
    protected String senha;
    
    protected void incorporarDTObase(UsuarioDTO usuario){
        this.nome = usuario.nome();
        this.email = usuario.email();
        this.senha = usuario.senha();
    }

    protected UsuarioDTO criarDTObase(){
        return new UsuarioDTO(nome, email, senha);
    }
}
