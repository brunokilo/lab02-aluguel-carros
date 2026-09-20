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
    

    protected void incorporarDTObase(UsuarioDTO usuario){
        this.nome = usuario.nome();
    }

    protected UsuarioDTO criarDTObase(){
        return new UsuarioDTO(nome);
    }
}
