package com.alucar.alucar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.alucar.alucar.dto.AgenteCadastroDTO;
import com.alucar.alucar.dto.AgenteDTO;
import com.alucar.alucar.service.AgenteService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AgenteController {

    private final AgenteService agenteService;

    public AgenteController(AgenteService agenteService) {
        this.agenteService = agenteService;
    }

    // POST /agentes  body: { "nome": "...", "email": "...", "senha": "..." }
    @PostMapping("/agentes")
    public ResponseEntity<AgenteDTO> criarAgente(@Valid @RequestBody AgenteCadastroDTO dto) {
        return ResponseEntity.ok(agenteService.criarAgente(dto));
    }

    // POST /bancos — mesmo corpo; cria um Banco (que também é um Agente)
    @PostMapping("/bancos")
    public ResponseEntity<AgenteDTO> criarBanco(@Valid @RequestBody AgenteCadastroDTO dto) {
        return ResponseEntity.ok(agenteService.criarBanco(dto));
    }

    @GetMapping("/agentes/{id}")
    public ResponseEntity<AgenteDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(agenteService.buscarPorId(id));
    }
}
