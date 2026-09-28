package com.alucar.alucar.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alucar.alucar.dto.AgenteCadastroDTO;
import com.alucar.alucar.dto.AgenteDTO;
import com.alucar.alucar.model.Agente;
import com.alucar.alucar.model.Banco;
import com.alucar.alucar.repository.AgenteRepository;
import com.alucar.alucar.repository.UsuarioRepository;

@Service
public class AgenteService {

    private final AgenteRepository agenteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AgenteService(
            AgenteRepository agenteRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.agenteRepository = agenteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AgenteDTO criarAgente(AgenteCadastroDTO dto) {
        return salvar(new Agente(), dto);
    }

    public AgenteDTO criarBanco(AgenteCadastroDTO dto) {
        return salvar(new Banco(), dto);
    }

    public AgenteDTO buscarPorId(Long id) {
        Agente agente = agenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado."));

        return paraDTO(agente);
    }

    // Agente e Banco só diferem pela classe — o cadastro é idêntico
    private AgenteDTO salvar(Agente agente, AgenteCadastroDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new IllegalStateException("Já existe um usuário cadastrado com este e-mail.");
        }

        agente.setNome(dto.nome());
        agente.setEmail(dto.email());
        agente.setSenha(passwordEncoder.encode(dto.senha()));

        return paraDTO(agenteRepository.save(agente));
    }

    private AgenteDTO paraDTO(Agente agente) {
        return new AgenteDTO(agente.getId(), agente.getNome(), agente.getEmail());
    }
}
