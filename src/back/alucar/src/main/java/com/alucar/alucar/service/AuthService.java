package com.alucar.alucar.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.LoginRequestDTO;
import com.alucar.alucar.dto.LoginResponseDTO;
import com.alucar.alucar.model.Cliente;
import com.alucar.alucar.repository.ClienteRepository;

@Service
public class AuthService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(ClienteRepository clienteRepository, PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Cliente cliente = clienteRepository.findByEmail(dto.email())
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos"));

        if (!passwordEncoder.matches(dto.senha(), cliente.getSenha())) {
            // Mesma mensagem de quando o e-mail não existe — evita que alguém
            // descubra por tentativa e erro quais e-mails estão cadastrados
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }

        return new LoginResponseDTO(cliente.getId(), cliente.getNome(), cliente.getEmail());
    }
}
