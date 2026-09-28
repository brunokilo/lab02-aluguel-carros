package com.alucar.alucar.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.alucar.alucar.dto.AutomovelDTO;
import com.alucar.alucar.service.AutomovelService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/automoveis")
@CrossOrigin(origins = "http://localhost:5173")
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @PostMapping
    public ResponseEntity<AutomovelDTO> criar(@Valid @RequestBody AutomovelDTO dto) {
        return ResponseEntity.ok(automovelService.criar(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutomovelDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(automovelService.buscarPorId(id));
    }

    // GET /automoveis?page=0&size=10
    @GetMapping
    public ResponseEntity<Page<AutomovelDTO>> listar(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(automovelService.listar(pageable));
    }

    // GET /automoveis/disponiveis?page=0&size=10 — só carros livres pro cliente escolher
    @GetMapping("/disponiveis")
    public ResponseEntity<Page<AutomovelDTO>> listarDisponiveis(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(automovelService.listarDisponiveis(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AutomovelDTO> atualizar(
            @PathVariable Long id, @Valid @RequestBody AutomovelDTO dto) {
        return ResponseEntity.ok(automovelService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        automovelService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
