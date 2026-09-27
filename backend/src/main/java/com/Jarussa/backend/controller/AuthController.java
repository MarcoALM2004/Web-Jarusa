package com.Jarussa.backend.controller;

import com.Jarussa.backend.dto.AuthResponse;
import com.Jarussa.backend.dto.LoginRequest;
import com.Jarussa.backend.dto.RegistroRequest;
import com.Jarussa.backend.model.Rol;
import com.Jarussa.backend.model.Usuario;
import com.Jarussa.backend.repository.UsuarioRepository;
import com.Jarussa.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Correo o contraseña incorrectos"));
        }

        Usuario usuario = usuarioOpt.get();

        boolean coincide = passwordEncoder.matches(request.getContrasena(), usuario.getContrasena());

        if (!coincide) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Correo o contraseña incorrectos"));
        }

        String token = jwtService.generarToken(usuario.getEmail(), usuario.getRol().name());

        AuthResponse response = new AuthResponse(
                token, usuario.getNombre(), usuario.getEmail(), usuario.getRol().name()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ese correo ya esta registrado"));
        }

        String hash = passwordEncoder.encode(request.getContrasena());

        Usuario nuevoUsuario = new Usuario(
                request.getNombre(), request.getEmail(), hash, Rol.CLIENTE
        );

        usuarioRepository.save(nuevoUsuario);

        String token = jwtService.generarToken(nuevoUsuario.getEmail(), nuevoUsuario.getRol().name());

        AuthResponse response = new AuthResponse(
                token, nuevoUsuario.getNombre(), nuevoUsuario.getEmail(), nuevoUsuario.getRol().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}