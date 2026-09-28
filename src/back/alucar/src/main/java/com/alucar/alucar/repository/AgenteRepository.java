package com.alucar.alucar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.alucar.alucar.model.Agente;

public interface AgenteRepository extends JpaRepository<Agente, Long> {
}
