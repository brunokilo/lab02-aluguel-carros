package com.alucar.alucar.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.alucar.alucar.dto.AgenteCadastroDTO;
import com.alucar.alucar.dto.AgenteDTO;
import com.alucar.alucar.dto.AutomovelDTO;
import com.alucar.alucar.service.AgenteService;
import com.alucar.alucar.service.AutomovelService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AgenteController {

    private final AgenteService agenteService;
    private final AutomovelService automovelService;

    public AgenteController(AgenteService agenteService, AutomovelService automovelService) {
        this.agenteService = agenteService;
        this.automovelService = automovelService;
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

    // POST /agentes/3/automoveis — empresa/banco cadastra um carro da própria frota
    @PostMapping("/agentes/{agenteId}/automoveis")
    public ResponseEntity<AutomovelDTO> cadastrarAutomovel(
            @PathVariable Long agenteId,
            @Valid @RequestBody AutomovelDTO dto) {

        return ResponseEntity.ok(automovelService.criarParaAgente(agenteId, dto));
    }

    // GET /agentes/3/automoveis — frota cadastrada por esse agente/banco
    @GetMapping("/agentes/{agenteId}/automoveis")
    public ResponseEntity<List<AutomovelDTO>> listarAutomoveis(@PathVariable Long agenteId) {
        return ResponseEntity.ok(automovelService.listarDoAgente(agenteId));
    }
}
