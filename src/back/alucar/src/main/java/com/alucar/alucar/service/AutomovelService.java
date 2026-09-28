package com.alucar.alucar.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.AutomovelDTO;
import com.alucar.alucar.model.Agente;
import com.alucar.alucar.model.Automovel;
import com.alucar.alucar.repository.AgenteRepository;
import com.alucar.alucar.repository.AutomovelRepository;

@Service
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final AgenteRepository agenteRepository;

    public AutomovelService(AutomovelRepository automovelRepository, AgenteRepository agenteRepository) {
        this.automovelRepository = automovelRepository;
        this.agenteRepository = agenteRepository;
    }

    public AutomovelDTO criar(AutomovelDTO dto) {
        Automovel automovel = new Automovel();
        aplicarDTO(automovel, dto);

        return paraDTO(automovelRepository.save(automovel));
    }

    // Empresa/banco cadastra um carro da própria frota
    public AutomovelDTO criarParaAgente(Long agenteId, AutomovelDTO dto) {
        Agente agente = agenteRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado."));

        Automovel automovel = new Automovel();
        aplicarDTO(automovel, dto);
        automovel = automovelRepository.save(automovel);

        agente.getAutomoveis().add(automovel);
        agenteRepository.save(agente);

        return paraDTO(automovel);
    }

    // Frota cadastrada por um agente/banco específico
    public List<AutomovelDTO> listarDoAgente(Long agenteId) {
        Agente agente = agenteRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado."));

        return agente.getAutomoveis().stream().map(this::paraDTO).toList();
    }

    public AutomovelDTO buscarPorId(Long id) {
        return paraDTO(buscarOuLancar(id));
    }

    public Page<AutomovelDTO> listar(Pageable pageable) {
        return automovelRepository.findAll(pageable).map(this::paraDTO);
    }

    public Page<AutomovelDTO> listarDisponiveis(Pageable pageable) {
        return automovelRepository.findByEmUsoFalse(pageable).map(this::paraDTO);
    }

    public AutomovelDTO atualizar(Long id, AutomovelDTO dto) {
        Automovel automovel = buscarOuLancar(id);
        aplicarDTO(automovel, dto);

        return paraDTO(automovelRepository.save(automovel));
    }

    public void excluir(Long id) {
        automovelRepository.delete(buscarOuLancar(id));
    }

    private Automovel buscarOuLancar(Long id) {
        return automovelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Automóvel não encontrado."));
    }

    private void aplicarDTO(Automovel automovel, AutomovelDTO dto) {
        automovel.setPlaca(dto.placa());
        automovel.setAno(dto.ano());
        automovel.setMarca(dto.marca());
        automovel.setModelo(dto.modelo());
        automovel.setEmUso(dto.emUso());
    }

    private AutomovelDTO paraDTO(Automovel automovel) {
        return new AutomovelDTO(
            automovel.getId(),
            automovel.getPlaca(),
            automovel.getAno(),
            automovel.getMarca(),
            automovel.getModelo(),
            automovel.isEmUso()
        );
    }
}
