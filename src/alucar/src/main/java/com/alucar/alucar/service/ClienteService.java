package com.alucar.alucar.service;

import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.ClienteDTO;
import com.alucar.alucar.model.Cliente;
import com.alucar.alucar.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public ClienteDTO criar(ClienteDTO dto) {

        validarEmpregadores(dto);

        Cliente cliente = new Cliente();
        cliente.incorporarDTO(dto);

        Cliente clienteSalvo = clienteRepository.save(cliente);

        return clienteSalvo.criarDTO();
    }

    public ClienteDTO buscarPorId(Long id) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Cliente não encontrado."));

        return cliente.criarDTO();
    }

    public ClienteDTO atualizar(Long id, ClienteDTO dto) {

        validarEmpregadores(dto);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Cliente não encontrado."));

        cliente.incorporarDTO(dto);

        Cliente clienteAtualizado = clienteRepository.save(cliente);

        return clienteAtualizado.criarDTO();
    }

    public void excluir(Long id) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Cliente não encontrado."));

        clienteRepository.delete(cliente);
    }

    private void validarEmpregadores(ClienteDTO dto) {

        if (dto.empregadores() != null &&
            dto.empregadores().size() > 3) {

            throw new IllegalArgumentException(
                "O cliente pode ter no máximo 3 empregadores."
            );
        }
    }
}