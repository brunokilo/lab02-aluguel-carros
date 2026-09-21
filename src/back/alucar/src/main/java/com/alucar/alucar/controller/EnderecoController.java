package com.alucar.alucar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alucar.alucar.dto.EnderecoDTO;
import com.alucar.alucar.service.EnderecoService;

@RestController
@RequestMapping("/enderecos")
@CrossOrigin(origins = "http://localhost:5173")
public class EnderecoController {

    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @PostMapping
    public ResponseEntity<EnderecoDTO> criar(
            @RequestBody EnderecoDTO dto) {

        return ResponseEntity.ok(enderecoService.criar(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnderecoDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(enderecoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnderecoDTO> atualizar(
            @PathVariable Long id,
            @RequestBody EnderecoDTO dto) {

        return ResponseEntity.ok(enderecoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        enderecoService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}