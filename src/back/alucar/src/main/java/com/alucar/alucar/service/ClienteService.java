package com.alucar.alucar.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.ClienteDTO;
import com.alucar.alucar.dto.EmpregadorDTO;
import com.alucar.alucar.dto.EnderecoDTO;
import com.alucar.alucar.model.Cliente;
import com.alucar.alucar.model.Empregador;
import com.alucar.alucar.model.Endereco;
import com.alucar.alucar.repository.ClienteRepository;
import com.alucar.alucar.repository.UsuarioRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ClienteDTO criar(ClienteDTO dto) {

        validarEmpregadores(dto.empregadores());

        if (usuarioRepository.existsByEmail(dto.usuario().email())) {
            throw new IllegalStateException("Já existe um usuário cadastrado com este e-mail.");
        }

        Cliente cliente = new Cliente();
        cliente.incorporarDTO(dto);
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));

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

        validarEmpregadores(dto.empregadores());

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Cliente não encontrado."));

        cliente.incorporarDTO(dto);

        Cliente clienteAtualizado = clienteRepository.save(cliente);

        return clienteAtualizado.criarDTO();
    }

    public ClienteDTO atualizarEndereco(Long id, EnderecoDTO dto) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Cliente não encontrado."));

        Endereco endereco = cliente.getEndereco() != null ? cliente.getEndereco() : new Endereco();
        endereco.incorporarDTO(dto);
        endereco.setCliente(cliente);
        cliente.setEndereco(endereco);

        Cliente clienteAtualizado = clienteRepository.save(cliente);

        return clienteAtualizado.criarDTO();
    }

    public ClienteDTO atualizarEmpregadores(Long id, List<EmpregadorDTO> dtos) {

        validarEmpregadores(dtos);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Cliente não encontrado."));

        List<Empregador> novos = (dtos != null ? dtos : List.<EmpregadorDTO>of()).stream()
            .map(dto -> {
                Empregador emp = new Empregador();
                emp.setNome(dto.nome());
                emp.setRendimento(dto.rendimento());
                emp.setCliente(cliente);
                return emp;
            })
            .toList();

        cliente.getEmpregadores().clear();
        cliente.getEmpregadores().addAll(novos);

        Cliente clienteAtualizado = clienteRepository.save(cliente);

        return clienteAtualizado.criarDTO();
    }

    public void excluir(Long id) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Cliente não encontrado."));

        clienteRepository.delete(cliente);
    }

    private void validarEmpregadores(List<EmpregadorDTO> empregadores) {

        if (empregadores != null && empregadores.size() > 3) {

            throw new IllegalArgumentException(
                "O cliente pode ter no máximo 3 empregadores."
            );
        }
    }
}
