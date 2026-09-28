package com.alucar.alucar.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alucar.alucar.controller.exception.CredenciaisInvalidasException;
import com.alucar.alucar.dto.LoginRequestDTO;
import com.alucar.alucar.dto.LoginResponseDTO;
import com.alucar.alucar.model.Agente;
import com.alucar.alucar.model.Banco;
import com.alucar.alucar.model.Usuario;
import com.alucar.alucar.repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(CredenciaisInvalidasException::new);

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new CredenciaisInvalidasException();
        }

        return new LoginResponseDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            descobrirTipo(usuario)
        );
    }

    private String descobrirTipo(Usuario usuario) {
        // Banco vem antes de Agente, porque Banco é subclasse de Agente
        if (usuario instanceof Banco) return "BANCO";
        if (usuario instanceof Agente) return "AGENTE";
        return "CLIENTE";
    }
}
