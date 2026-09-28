package com.alucar.alucar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.alucar.alucar.model.Empregador;


public interface EmpregadorRepository extends JpaRepository <Empregador, Long>{
    
}
