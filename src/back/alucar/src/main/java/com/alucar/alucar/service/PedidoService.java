package com.alucar.alucar.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.AutomovelDTO;
import com.alucar.alucar.dto.PedidoCriacaoDTO;
import com.alucar.alucar.dto.PedidoDTO;
import com.alucar.alucar.enums.Parecer;
import com.alucar.alucar.enums.StatusPedido;
import com.alucar.alucar.model.Agente;
import com.alucar.alucar.model.Automovel;
import com.alucar.alucar.model.Cliente;
import com.alucar.alucar.model.Pedido;
import com.alucar.alucar.repository.AgenteRepository;
import com.alucar.alucar.repository.AutomovelRepository;
import com.alucar.alucar.repository.ClienteRepository;
import com.alucar.alucar.repository.PedidoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final AgenteRepository agenteRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            AgenteRepository agenteRepository,
            ClienteRepository clienteRepository,
            AutomovelRepository automovelRepository) {
        this.pedidoRepository = pedidoRepository;
        this.agenteRepository = agenteRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
    }

    public PedidoDTO criar(Long clienteId, PedidoCriacaoDTO dto) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        Automovel automovel = buscarAutomovelDisponivelOuLancar(dto.automovelId());

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setAutomovelDesejado(automovel);
        pedido.setDataCriacao(LocalDate.now());
        pedido.setStatus(StatusPedido.CRIADO);

        return paraDTO(pedidoRepository.save(pedido));
    }

    // Cliente altera o automóvel escolhido — só permitido antes da avaliação
    public PedidoDTO alterar(Long pedidoId, Long clienteId, PedidoCriacaoDTO dto) {
        Pedido pedido = buscarDoClienteOuLancar(pedidoId, clienteId);

        if (pedido.getStatus() != StatusPedido.CRIADO) {
            throw new IllegalStateException("Só é possível alterar um pedido que ainda não foi avaliado.");
        }

        Automovel automovel = buscarAutomovelDisponivelOuLancar(dto.automovelId());
        pedido.setAutomovelDesejado(automovel);

        return paraDTO(pedidoRepository.save(pedido));
    }

    public Page<PedidoDTO> listarPorCliente(Long clienteId, Pageable pageable) {
        return pedidoRepository.findByClienteId(clienteId, pageable)
                .map(this::paraDTO);
    }

    public PedidoDTO cancelar(Long pedidoId, Long clienteId) {
        Pedido pedido = buscarDoClienteOuLancar(pedidoId, clienteId);

        if (pedido.getStatus() != StatusPedido.CRIADO) {
            throw new IllegalStateException("Só é possível cancelar um pedido que ainda não foi avaliado.");
        }

        pedido.setStatus(StatusPedido.CANCELADO);
        return paraDTO(pedidoRepository.save(pedido));
    }

    public PedidoDTO avaliar(Long pedidoId, Long agenteId, Parecer parecer) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        if (pedido.getStatus() != StatusPedido.CRIADO) {
            throw new IllegalStateException("Este pedido já foi avaliado.");
        }

        Agente agente = agenteRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado."));

        pedido.setAgente(agente);
        pedido.setParecer(parecer);
        pedido.setStatus(parecer == Parecer.NEGATIVO ? StatusPedido.RECUSADO : StatusPedido.AVALIADO);

        return paraDTO(pedidoRepository.save(pedido));
    }

    public PedidoDTO decidirAvancar(Long pedidoId, Long clienteId) {
        Pedido pedido = buscarDoClienteOuLancar(pedidoId, clienteId);

        if (pedido.getStatus() != StatusPedido.AVALIADO || pedido.getParecer() != Parecer.POSITIVO) {
            throw new IllegalStateException("Este pedido não está com parecer positivo aguardando decisão.");
        }

        pedido.setStatus(StatusPedido.APROVADO);
        return paraDTO(pedidoRepository.save(pedido));
    }

    private Automovel buscarAutomovelDisponivelOuLancar(Long automovelId) {
        Automovel automovel = automovelRepository.findById(automovelId)
                .orElseThrow(() -> new RuntimeException("Automóvel não encontrado."));

        if (automovel.isEmUso()) {
            throw new IllegalStateException("Este automóvel já está em uso e não está disponível.");
        }

        return automovel;
    }

    private Pedido buscarDoClienteOuLancar(Long pedidoId, Long clienteId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        if (!pedido.getCliente().getId().equals(clienteId)) {
            throw new IllegalArgumentException("Este pedido não pertence a este cliente.");
        }

        return pedido;
    }

    private PedidoDTO paraDTO(Pedido pedido) {
        Automovel automovel = pedido.getAutomovelDesejado();

        AutomovelDTO automovelDTO = new AutomovelDTO(
            automovel.getId(),
            automovel.getPlaca(),
            automovel.getAno(),
            automovel.getMarca(),
            automovel.getModelo(),
            automovel.isEmUso()
        );

        return new PedidoDTO(
            pedido.getId(),
            pedido.getDataCriacao(),
            pedido.getStatus(),
            pedido.getParecer(),
            automovelDTO
        );
    }
}
