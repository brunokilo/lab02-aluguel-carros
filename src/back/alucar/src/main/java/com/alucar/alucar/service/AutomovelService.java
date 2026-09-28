package com.alucar.alucar.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.AutomovelDTO;
import com.alucar.alucar.model.Automovel;
import com.alucar.alucar.repository.AutomovelRepository;

@Service
public class AutomovelService {

    private final AutomovelRepository automovelRepository;

    public AutomovelService(AutomovelRepository automovelRepository) {
        this.automovelRepository = automovelRepository;
    }

    public AutomovelDTO criar(AutomovelDTO dto) {
        Automovel automovel = new Automovel();
        aplicarDTO(automovel, dto);

        return paraDTO(automovelRepository.save(automovel));
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
