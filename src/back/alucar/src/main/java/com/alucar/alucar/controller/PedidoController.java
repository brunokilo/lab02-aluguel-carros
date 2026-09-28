package com.alucar.alucar.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.alucar.alucar.dto.PedidoCriacaoDTO;
import com.alucar.alucar.dto.PedidoDTO;
import com.alucar.alucar.enums.Parecer;
import com.alucar.alucar.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // POST /clientes/5/pedidos  body: { "automovelId": 3 }
    @PostMapping("/clientes/{clienteId}/pedidos")
    public ResponseEntity<PedidoDTO> criar(
            @PathVariable Long clienteId,
            @Valid @RequestBody PedidoCriacaoDTO dto) {

        return ResponseEntity.ok(pedidoService.criar(clienteId, dto));
    }

    // PUT /pedidos/12?clienteId=5  body: { "automovelId": 7 }
    @PutMapping("/pedidos/{pedidoId}")
    public ResponseEntity<PedidoDTO> alterar(
            @PathVariable Long pedidoId,
            @RequestParam Long clienteId,
            @Valid @RequestBody PedidoCriacaoDTO dto) {

        return ResponseEntity.ok(pedidoService.alterar(pedidoId, clienteId, dto));
    }

    // GET /clientes/5/pedidos?page=0&size=10&sort=dataCriacao,desc
    @GetMapping("/clientes/{clienteId}/pedidos")
    public ResponseEntity<Page<PedidoDTO>> listar(
            @PathVariable Long clienteId,
            @PageableDefault(size = 10, sort = "dataCriacao") Pageable pageable) {

        return ResponseEntity.ok(pedidoService.listarPorCliente(clienteId, pageable));
    }

    // PUT /pedidos/12/cancelar?clienteId=5
    @PutMapping("/pedidos/{pedidoId}/cancelar")
    public ResponseEntity<PedidoDTO> cancelar(
            @PathVariable Long pedidoId,
            @RequestParam Long clienteId) {

        return ResponseEntity.ok(pedidoService.cancelar(pedidoId, clienteId));
    }

    // GET /pedidos/pendentes?page=0&size=10 — fila de avaliação do agente
    @GetMapping("/pedidos/pendentes")
    public ResponseEntity<Page<PedidoDTO>> listarPendentes(
            @PageableDefault(size = 10, sort = "dataCriacao") Pageable pageable) {

        return ResponseEntity.ok(pedidoService.listarPendentes(pageable));
    }

    // PUT /pedidos/12/avaliar?agenteId=3  body: "POSITIVO" ou "NEGATIVO"
    @PutMapping("/pedidos/{pedidoId}/avaliar")
    public ResponseEntity<PedidoDTO> avaliar(
            @PathVariable Long pedidoId,
            @RequestParam Long agenteId,
            @RequestBody Parecer parecer) {

        return ResponseEntity.ok(pedidoService.avaliar(pedidoId, agenteId, parecer));
    }

    // PUT /pedidos/12/avancar?clienteId=5
    @PutMapping("/pedidos/{pedidoId}/avancar")
    public ResponseEntity<PedidoDTO> decidirAvancar(
            @PathVariable Long pedidoId,
            @RequestParam Long clienteId) {

        return ResponseEntity.ok(pedidoService.decidirAvancar(pedidoId, clienteId));
    }
}
