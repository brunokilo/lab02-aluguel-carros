package com.alucar.alucar.service;

import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.EnderecoDTO;
import com.alucar.alucar.model.Endereco;
import com.alucar.alucar.repository.EnderecoRepository;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    public EnderecoService(EnderecoRepository enderecoRepository) {
        this.enderecoRepository = enderecoRepository;
    }

    public EnderecoDTO criar(EnderecoDTO dto) {

        Endereco endereco = new Endereco();

        endereco.incorporarDTO(dto);

        Endereco enderecoSalvo = enderecoRepository.save(endereco);

        return enderecoSalvo.criarDTO();
    }

    public EnderecoDTO buscarPorId(Long id) {

        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado."));

        return endereco.criarDTO();
    }

    public EnderecoDTO atualizar(Long id, EnderecoDTO dto) {

        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado."));

        endereco.incorporarDTO(dto);

        Endereco enderecoAtualizado = enderecoRepository.save(endereco);

        return enderecoAtualizado.criarDTO();
    }

    public void excluir(Long id) {

        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado."));

        enderecoRepository.delete(endereco);
    }
}