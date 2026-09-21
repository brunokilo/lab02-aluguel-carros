package com.alucar.alucar.controller;

import com.alucar.alucar.dto.EmpregadorDTO;
import com.alucar.alucar.model.Empregador;
import com.alucar.alucar.repository.EmpregadorRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/empregadores")
public class EmpregadorController {

    @Autowired
    private EmpregadorRepository empregadorRepository;

    @GetMapping
    public List<EmpregadorDTO> listar() {
        return empregadorRepository.findAll()
                .stream()
                .map(Empregador::criarDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpregadorDTO> buscarPorId(@PathVariable Long id) {
        return empregadorRepository.findById(id)
                .map(Empregador::criarDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EmpregadorDTO> criar(@RequestBody @Valid EmpregadorDTO dto) {
        Empregador empregador = new Empregador();
        empregador.incorporarDTO(dto);

        Empregador salvo = empregadorRepository.save(empregador);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo.criarDTO());
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<EmpregadorDTO> atualizar(@PathVariable Long id, @RequestBody @Valid EmpregadorDTO dto) {
        return empregadorRepository.findById(id)
                .map(empregador -> {
                    empregador.incorporarDTO(dto);
                    Empregador atualizado = empregadorRepository.save(empregador);
                    return ResponseEntity.ok(atualizado.criarDTO());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!empregadorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        empregadorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}