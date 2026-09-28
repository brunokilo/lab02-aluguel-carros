package com.alucar.alucar.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.AutomovelDTO;
import com.alucar.alucar.dto.EmpregadorDTO;
import com.alucar.alucar.dto.PedidoCriacaoDTO;
import com.alucar.alucar.dto.PedidoDTO;
import com.alucar.alucar.enums.ModalidadeContrato;
import com.alucar.alucar.enums.Parecer;
import com.alucar.alucar.enums.StatusPedido;
import com.alucar.alucar.model.Agente;
import com.alucar.alucar.model.Automovel;
import com.alucar.alucar.model.Banco;
import com.alucar.alucar.model.Cliente;
import com.alucar.alucar.model.ContratoCredito;
import com.alucar.alucar.model.Pedido;
import com.alucar.alucar.repository.AgenteRepository;
import com.alucar.alucar.repository.AutomovelRepository;
import com.alucar.alucar.repository.ClienteRepository;
import com.alucar.alucar.repository.ContratoCreditoRepository;
import com.alucar.alucar.repository.PedidoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final AgenteRepository agenteRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;
    private final ContratoCreditoRepository contratoCreditoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            AgenteRepository agenteRepository,
            ClienteRepository clienteRepository,
            AutomovelRepository automovelRepository,
            ContratoCreditoRepository contratoCreditoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.agenteRepository = agenteRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
        this.contratoCreditoRepository = contratoCreditoRepository;
    }

    public PedidoDTO criar(Long clienteId, PedidoCriacaoDTO dto) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        Automovel automovel = buscarAutomovelDisponivelOuLancar(dto.automovelId());

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setAutomovelDesejado(automovel);
        pedido.setModalidade(dto.modalidade());
        pedido.setDataCriacao(LocalDate.now());
        pedido.setStatus(StatusPedido.CRIADO);

        return paraDTO(pedidoRepository.save(pedido));
    }

    // Cliente altera o automóvel/modalidade escolhidos — só permitido antes da avaliação
    public PedidoDTO alterar(Long pedidoId, Long clienteId, PedidoCriacaoDTO dto) {
        Pedido pedido = buscarDoClienteOuLancar(pedidoId, clienteId);

        if (pedido.getStatus() != StatusPedido.CRIADO) {
            throw new IllegalStateException("Só é possível alterar um pedido que ainda não foi avaliado.");
        }

        Automovel automovel = buscarAutomovelDisponivelOuLancar(dto.automovelId());
        pedido.setAutomovelDesejado(automovel);
        pedido.setModalidade(dto.modalidade());

        return paraDTO(pedidoRepository.save(pedido));
    }

    public Page<PedidoDTO> listarPorCliente(Long clienteId, Pageable pageable) {
        return pedidoRepository.findByClienteId(clienteId, pageable)
                .map(this::paraDTO);
    }

    // Pedidos ainda não avaliados por nenhum agente — fila de trabalho do agente
    public Page<PedidoDTO> listarPendentes(Pageable pageable) {
        return pedidoRepository.findByStatus(StatusPedido.CRIADO, pageable)
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

        // Leasing envolve um contrato de crédito, então só um banco pode avaliar
        if (pedido.getModalidade() == ModalidadeContrato.LEASING && !(agente instanceof Banco)) {
            throw new IllegalStateException("Pedidos de leasing só podem ser avaliados por um banco.");
        }

        pedido.setAgente(agente);
        pedido.setParecer(parecer);
        pedido.setStatus(parecer == Parecer.NEGATIVO ? StatusPedido.RECUSADO : StatusPedido.AVALIADO);

        if (pedido.getModalidade() == ModalidadeContrato.LEASING && parecer == Parecer.POSITIVO) {
            Banco banco = (Banco) agente;

            ContratoCredito contrato = new ContratoCredito();
            contrato.setNumero("CC-" + pedidoId);
            banco.aprovarContratoCredito(contrato);

            pedido.setContratoCredito(contratoCreditoRepository.save(contrato));
        }

        return paraDTO(pedidoRepository.save(pedido));
    }

    public PedidoDTO decidirAvancar(Long pedidoId, Long clienteId) {
        Pedido pedido = buscarDoClienteOuLancar(pedidoId, clienteId);

        if (pedido.getStatus() != StatusPedido.AVALIADO || pedido.getParecer() != Parecer.POSITIVO) {
            throw new IllegalStateException("Este pedido não está com parecer positivo aguardando decisão.");
        }

        pedido.setStatus(StatusPedido.APROVADO);

        // Execução do contrato: o carro passa a estar de fato em uso
        Automovel automovel = pedido.getAutomovelDesejado();
        automovel.setEmUso(true);
        automovelRepository.save(automovel);

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
        Cliente cliente = pedido.getCliente();

        AutomovelDTO automovelDTO = new AutomovelDTO(
            automovel.getId(),
            automovel.getPlaca(),
            automovel.getAno(),
            automovel.getMarca(),
            automovel.getModelo(),
            automovel.isEmUso()
        );

        List<EmpregadorDTO> empregadoresDTO = cliente.getEmpregadores().stream()
            .map(empregador -> empregador.criarDTO())
            .toList();

        String numeroContratoCredito = pedido.getContratoCredito() != null
            ? pedido.getContratoCredito().getNumero()
            : null;

        return new PedidoDTO(
            pedido.getId(),
            pedido.getDataCriacao(),
            pedido.getStatus(),
            pedido.getParecer(),
            pedido.getModalidade(),
            automovelDTO,
            cliente.getId(),
            cliente.getNome(),
            empregadoresDTO,
            numeroContratoCredito
        );
    }
}
