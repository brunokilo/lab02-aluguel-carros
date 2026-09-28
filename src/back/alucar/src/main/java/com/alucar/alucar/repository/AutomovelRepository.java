package com.alucar.alucar.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.alucar.alucar.model.Automovel;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    // Útil pro cliente ver só carros disponíveis na hora de escolher um pra alugar
    Page<Automovel> findByEmUsoFalse(Pageable pageable);
}
