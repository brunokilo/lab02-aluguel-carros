package com.alucar.alucar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.alucar.alucar.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);
}